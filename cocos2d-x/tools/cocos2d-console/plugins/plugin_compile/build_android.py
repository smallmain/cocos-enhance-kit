#!/usr/bin/python
# build_native.py
# Build native codes


import sys
import os, os.path
import shutil
from optparse import OptionParser
import cocos
from MultiLanguage import MultiLanguage
import cocos_project
import json
import re
from xml.dom import minidom

import utils

import project_compile

BUILD_CFIG_FILE="build-cfg.json"

class AndroidBuilder(object):

    CFG_KEY_COPY_TO_ASSETS = "copy_to_assets"
    CFG_KEY_MUST_COPY_TO_ASSERTS = "must_copy_to_assets"
    CFG_KEY_STORE = "key_store"
    CFG_KEY_STORE_PASS = "key_store_pass"
    CFG_KEY_ALIAS = "alias"
    CFG_KEY_ALIAS_PASS = "alias_pass"

    GRADLE_KEY_STORE = "RELEASE_STORE_FILE"
    GRADLE_KEY_ALIAS = "RELEASE_KEY_ALIAS"
    GRADLE_KEY_STORE_PASS = "RELEASE_STORE_PASSWORD"
    GRADLE_KEY_ALIAS_PASS = "RELEASE_KEY_PASSWORD"

    def __init__(self, verbose, app_android_root, no_res, proj_obj):
        self._verbose = verbose

        self.app_android_root = app_android_root
        self._no_res = no_res
        self._project = proj_obj

        # check environment variable
        self.sdk_root = cocos.check_environment_variable('ANDROID_SDK_ROOT')
        self.sign_prop_file = os.path.join(self.app_android_root, "gradle.properties")

        self._parse_cfg()

    def _run_cmd(self, command, cwd=None):
        cocos.CMDRunner.run_cmd(command, self._verbose, cwd=cwd)

    def _parse_cfg(self):
        self.cfg_path = os.path.join(self.app_android_root, BUILD_CFIG_FILE)
        try:
            f = open(self.cfg_path)
            cfg = json.load(f, encoding='utf8')
            f.close()
        except Exception:
            raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_PARSE_CFG_FAILED_FMT', self.cfg_path),
                                      cocos.CCPluginError.ERROR_PARSE_FILE)

        if cfg.has_key(project_compile.CCPluginCompile.CFG_KEY_MUST_COPY_RESOURCES):
            if self._no_res:
                self.res_files = cfg[project_compile.CCPluginCompile.CFG_KEY_MUST_COPY_RESOURCES]
            else:
                self.res_files = cfg[project_compile.CCPluginCompile.CFG_KEY_MUST_COPY_RESOURCES] + cfg[project_compile.CCPluginCompile.CFG_KEY_COPY_RESOURCES]
        else:
            self.res_files = cfg[project_compile.CCPluginCompile.CFG_KEY_COPY_RESOURCES]

        self.ndk_module_paths = cfg['ndk_module_path']

        # get the properties for sign release apk
        self.key_store_str = AndroidBuilder.GRADLE_KEY_STORE
        self.key_alias_str = AndroidBuilder.GRADLE_KEY_ALIAS
        self.key_store_pass_str = AndroidBuilder.GRADLE_KEY_STORE_PASS
        self.key_alias_pass_str = AndroidBuilder.GRADLE_KEY_ALIAS_PASS

        move_cfg = {}
        self.key_store = None
        if cfg.has_key(AndroidBuilder.CFG_KEY_STORE):
            self.key_store = cfg[AndroidBuilder.CFG_KEY_STORE]
            move_cfg[self.key_store_str] = self.key_store
            del cfg[AndroidBuilder.CFG_KEY_STORE]

        self.key_store_pass = None
        if cfg.has_key(AndroidBuilder.CFG_KEY_STORE_PASS):
            self.key_store_pass = cfg[AndroidBuilder.CFG_KEY_STORE_PASS]
            move_cfg[self.key_store_pass_str] = self.key_store_pass
            del cfg[AndroidBuilder.CFG_KEY_STORE_PASS]

        self.alias = None
        if cfg.has_key(AndroidBuilder.CFG_KEY_ALIAS):
            self.alias = cfg[AndroidBuilder.CFG_KEY_ALIAS]
            move_cfg[self.key_alias_str] = self.alias
            del cfg[AndroidBuilder.CFG_KEY_ALIAS]

        self.alias_pass = None
        if cfg.has_key(AndroidBuilder.CFG_KEY_ALIAS_PASS):
            self.alias_pass = cfg[AndroidBuilder.CFG_KEY_ALIAS_PASS]
            move_cfg[self.key_alias_pass_str] = self.alias_pass
            del cfg[AndroidBuilder.CFG_KEY_ALIAS_PASS]

        if len(move_cfg) > 0:
            # move the config into ant.properties
            self._move_cfg(move_cfg)
            with open(self.cfg_path, 'w') as outfile:
                json.dump(cfg, outfile, sort_keys = True, indent = 4)
                outfile.close()

    def has_keystore_in_signprops(self):
        keystore = None
        pattern = re.compile(r"^RELEASE_STORE_FILE=(.+)")

        try:
            file_obj = open(self.sign_prop_file)
            for line in file_obj:
                str1 = line.replace(' ', '')
                str2 = str1.replace('\t', '')
                match = pattern.match(str2)
                if match is not None:
                    keystore = match.group(1)
                    break
            file_obj.close()
        except:
            pass

        if keystore is None:
            return False
        else:
            return True

    def _write_sign_properties(self, cfg):
        file_obj = open(self.sign_prop_file, "a+")
        for key in cfg.keys():
            str_cfg = "%s=%s\n" % (key, cfg[key])
            file_obj.write(str_cfg)

        file_obj.close()

    def _move_cfg(self, cfg):
        if not self.has_keystore_in_signprops():
            self._write_sign_properties(cfg)

    def remove_c_libs(self, libs_dir):
        for file_name in os.listdir(libs_dir):
            lib_file = os.path.join(libs_dir,  file_name)
            if os.path.isfile(lib_file):
                ext = os.path.splitext(lib_file)[1]
                if ext == ".a" or ext == ".so":
                    os.remove(lib_file)

    def _get_android_sdk_tools_ver(self, sdk_tools_path):
        cfg_file = os.path.join(sdk_tools_path, 'source.properties')

        if os.path.isfile(cfg_file):
            f = open(cfg_file)
            lines = f.readlines()
            pattern = r'^Pkg\.Revision=(\d+)\.(\d+)'
            for l in lines:
                match = re.match(pattern, l.strip())
                if match:
                    return ((int)(match.group(1)), (int)(match.group(2)))

        raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_UNKNOWN_ANDROID_SDK_TOOLS_VERSION'),
                                  cocos.CCPluginError.ERROR_PATH_NOT_FOUND)

    def _update_project_properties(self, folder_path, target_str):
        props_path = os.path.join(folder_path, 'project.properties')
        f = open(props_path)
        lines = f.readlines()
        f.close()

        pattern = r'^target=(.*)$'
        matched = False
        new_line = 'target=%s\n' % target_str
        for i in range(0, len(lines)):
            l = lines[i]
            match = re.match(pattern, l.strip())
            if match:
                lines[i] = new_line
                matched = True

        if not matched:
            lines.append('\n')
            lines.append(new_line)

        f = open(props_path, 'w')
        f.writelines(lines)
        f.close()

    def _write_local_properties(self, folder_path):
        local_porps_path = os.path.join(folder_path, 'local.properties')
        sdk_dir = self.sdk_root
        ndk_dir = cocos.check_environment_variable('NDK_ROOT')
        if cocos.os_is_win32():
            # On Windows, the path should be like:
            # sdk.dir = C:\\path\\android-sdk
            sdk_dir = sdk_dir.replace('\\', '\\\\')
            ndk_dir = ndk_dir.replace('\\', '\\\\')
        lines = [
            'sdk.dir=%s\n' % sdk_dir,
            'ndk.dir=%s\n' % ndk_dir
        ]
        f = open(local_porps_path, 'w')
        f.writelines(lines)
        f.close()

    def update_project(self, android_platform):
        manifest_path = os.path.join(self.app_android_root, 'app')

        # check the android platform
        target_str = self.check_android_platform(self.sdk_root, android_platform, manifest_path)

        # should manually update the project
        self._write_local_properties(manifest_path)
        self._update_project_properties(manifest_path, target_str)

        # copy the local.properties to the app_android_root
        file_name = 'local.properties'
        src_path = os.path.normpath(os.path.join(manifest_path, file_name))
        dst_path = os.path.normpath(os.path.join(self.app_android_root, file_name))
        if src_path != dst_path:
            if os.path.isfile(dst_path):
                os.remove(dst_path)
            shutil.copy(src_path, dst_path)

    def get_toolchain_version(self, ndk_root, compile_obj):
        return "4.9"

    def do_ndk_build(self, ndk_build_param, build_mode, compile_obj):
        cocos.Logging.info(MultiLanguage.get_string('COMPILE_INFO_NDK_MODE', build_mode))
        ndk_root = cocos.check_environment_variable('NDK_ROOT')

        toolchain_version = self.get_toolchain_version(ndk_root, compile_obj)

        ndk_work_dir = os.path.join(self.app_android_root, 'app')

        reload(sys)
        sys.setdefaultencoding('utf8')
        ndk_path = cocos.CMDRunner.convert_path_to_cmd(os.path.join(ndk_root, "ndk-build"))

        module_paths = []
        for cfg_path in self.ndk_module_paths:
            the_path = cocos.replace_env_variable(cfg_path)
            if not os.path.isabs(the_path):
                the_path = os.path.normpath(os.path.join(self.app_android_root, the_path))

            module_paths.append(the_path)

        # delete template static and dynamic files
        obj_local_dir = os.path.join(ndk_work_dir, "obj", "local")
        if os.path.isdir(obj_local_dir):
            for abi_dir in os.listdir(obj_local_dir):
                static_file_path = os.path.join(ndk_work_dir, "obj", "local", abi_dir)
                if os.path.isdir(static_file_path):
                    self.remove_c_libs(static_file_path)

        # windows should use ";" to seperate module paths
        if cocos.os_is_win32():
            ndk_module_path = ';'.join(module_paths)
        else:
            ndk_module_path = ':'.join(module_paths)

        ndk_module_path= 'NDK_MODULE_PATH=' + ndk_module_path

        if ndk_build_param is None:
            ndk_build_cmd = '%s -C %s %s' % (ndk_path, ndk_work_dir, ndk_module_path)
        else:
            ndk_build_cmd = '%s -C %s %s %s' % (ndk_path, ndk_work_dir, ' '.join(ndk_build_param), ndk_module_path)

        ndk_build_cmd = '%s NDK_TOOLCHAIN_VERSION=%s' % (ndk_build_cmd, toolchain_version)

        if build_mode == 'debug':
            ndk_build_cmd = '%s NDK_DEBUG=1' % ndk_build_cmd

        self._run_cmd(ndk_build_cmd)


    def _xml_attr(self, dir, file_name, node_name, attr):
        doc = minidom.parse(os.path.join(dir, file_name))
        return doc.getElementsByTagName(node_name)[0].getAttribute(attr)

    def update_lib_projects(self, sdk_root, sdk_tool_path, android_platform, property_path):
        property_file = os.path.join(property_path, "project.properties")
        if not os.path.isfile(property_file):
            return

        patten = re.compile(r'^android\.library\.reference\.[\d]+=(.+)')
        for line in open(property_file):
            str1 = line.replace(' ', '')
            str2 = str1.replace('\t', '')
            match = patten.match(str2)
            if match is not None:
                # a lib project is found
                lib_path = match.group(1)
                abs_lib_path = os.path.join(property_path, lib_path)
                abs_lib_path = os.path.normpath(abs_lib_path)
                if os.path.isdir(abs_lib_path):
                    target_str = self.check_android_platform(sdk_root, android_platform, abs_lib_path)
                    command = "%s update lib-project -p %s -t %s" % (cocos.CMDRunner.convert_path_to_cmd(sdk_tool_path), abs_lib_path, target_str)
                    self._run_cmd(command)

                    self.update_lib_projects(sdk_root, sdk_tool_path, android_platform, abs_lib_path)

    def get_api_level(self, target_str, raise_error=True):
        match = re.match(r'android-(\d+)', target_str)
        if match is not None:
            ret = int(match.group(1))
        else:
            if raise_error:
                raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_NOT_VALID_AP_FMT', target_str),
                                          cocos.CCPluginError.ERROR_PARSE_FILE)
            else:
                ret = -1

        return ret

    def get_target_config(self, proj_path):
        property_file = os.path.join(proj_path, "project.properties")
        if not os.path.isfile(property_file):
            raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_FILE_NOT_FOUND_FMT', property_file),
                                      cocos.CCPluginError.ERROR_PATH_NOT_FOUND)

        patten = re.compile(r'^target=(.+)')
        for line in open(property_file):
            str1 = line.replace(' ', '')
            str2 = str1.replace('\t', '')
            match = patten.match(str2)
            if match is not None:
                target = match.group(1)
                target_num = self.get_api_level(target)
                if target_num > 0:
                    return target_num

        raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_TARGET_NOT_FOUND_FMT', property_file),
                                  cocos.CCPluginError.ERROR_PARSE_FILE)

    # check the selected android platform
    def check_android_platform(self, sdk_root, android_platform, proj_path):
        ret = android_platform
        if android_platform is None:
            min_platform = self.get_target_config(proj_path)
            # not specified platform, use the one in project.properties
            ret = 'android-%d' % min_platform

        ret_path = os.path.join(cocos.CMDRunner.convert_path_to_python(sdk_root), "platforms", ret)
        if not os.path.isdir(ret_path):
            raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_NO_AP_IN_SDK_FMT', ret),
                                      cocos.CCPluginError.ERROR_PATH_NOT_FOUND)

        return ret

    def gradle_build_apk(self, build_mode, instant_game):
        # check the compileSdkVersion & buildToolsVersion
        check_file = os.path.join(self.app_android_root, 'app', 'build.gradle')
        f = open(check_file)
        lines = f.readlines()
        f.close()

        compile_sdk_ver = None
        build_tools_ver = None
        compile_sdk_pattern = r'compileSdkVersion[ \t]+([\d]+)'
        build_tools_pattern = r'buildToolsVersion[ \t]+"(.+)"'
        for line in lines:
            line_str = line.strip()
            match1 = re.match(compile_sdk_pattern, line_str)
            if match1:
                compile_sdk_ver = match1.group(1)

            match2 = re.match(build_tools_pattern, line_str)
            if match2:
                build_tools_ver = match2.group(1)

        if compile_sdk_ver is not None:
            # check the compileSdkVersion
            check_folder_name = 'android-%s' % compile_sdk_ver
            check_path = os.path.join(self.sdk_root, 'platforms', check_folder_name)
            if not os.path.isdir(check_path):
                cocos.Logging.warning(MultiLanguage.get_string('COMPILE_WARNING_COMPILE_SDK_FMT',
                                                               (compile_sdk_ver, check_path)))

        if build_tools_ver is not None:
            # check the buildToolsVersion
            check_path = os.path.join(self.sdk_root, 'build-tools', build_tools_ver)
            if not os.path.isdir(check_path):
                cocos.Logging.warning(MultiLanguage.get_string('COMPILE_WARNING_BUILD_TOOLS_FMT',
                                                               (build_tools_ver, check_path)))

        # invoke gradlew for gradle building
        if cocos.os_is_win32():
            gradle_path = os.path.join(self.app_android_root, 'gradlew.bat')
        else:
            gradle_path = os.path.join(self.app_android_root, 'gradlew')

        if not os.path.isfile(gradle_path):
            raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_GRALEW_NOT_EXIST_FMT', gradle_path),
                                      cocos.CCPluginError.ERROR_PATH_NOT_FOUND)

        mode_str = 'Debug' if build_mode == 'debug' else 'Release'
        cmd = '"%s" --parallel --info ' % (gradle_path)
        if instant_game:
            cmd += ':instantapp:'
        cmd += 'assemble%s' % (mode_str)
        self._run_cmd(cmd, cwd=self.app_android_root)

    def do_build_apk(self, build_mode, no_apk, instant_game, output_dir, custom_step_args, compile_obj):
        project_name = None
        setting_file = os.path.join(self.app_android_root, 'settings.gradle')
        if os.path.isfile(setting_file):
            # get project name from settings.gradle
            f = open(setting_file)
            lines = f.readlines()
            f.close()
            pattern = r"project\(':(.*)'\)\.projectDir[ \t]*=[ \t]*new[ \t]*File\(settingsDir, 'app'\)"
            for line in lines:
                line_str = line.strip()
                match = re.match(pattern, line_str)
                if match:
                    project_name = match.group(1)
                    break
        if instant_game:
            project_name = 'instantapp'
        if project_name is None:
            # use default project name
            project_name = 'app'
        if instant_game:
            relative_path = '%s/build/outputs/apk' % (project_name)
            gen_apk_folder = os.path.join(self.app_android_root, relative_path)
        else:
            gen_apk_folder = os.path.join(self.app_android_root, 'app/build/outputs/apk')

        if not no_apk:
            # remove old apk file
            if os.path.isdir(gen_apk_folder):
                shutil.rmtree(gen_apk_folder)

            # gather the sign info if necessary
            if build_mode == "release" and not self.has_keystore_in_signprops():
                self._gather_sign_info()

            # build apk
            self.gradle_build_apk(build_mode, instant_game)

            # copy the apk to output dir
            if output_dir:
                apk_name = '%s-%s' % (project_name, build_mode)
                apk_name += '.apk'
                gen_apk_path = os.path.join(gen_apk_folder, apk_name)

                # Android Studio 2.x.x uses 'app/build/outputs/apk' as output directory,
                # but Android Studio 3.x.x appends 'debug' or 'release' directory after 'app/build/outputs/apk'.
                if not os.path.exists(gen_apk_path):
                    gen_apk_path = os.path.join(gen_apk_folder, build_mode, apk_name)

                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                shutil.copy(gen_apk_path, output_dir)
                cocos.Logging.info(MultiLanguage.get_string('COMPILE_INFO_MOVE_APK_FMT', output_dir))

                if build_mode == "release":
                    signed_name = "%s-%s-signed" % (project_name, build_mode)
                    signed_name += '.apk'
                    apk_path = os.path.join(output_dir, signed_name)
                    if os.path.exists(apk_path):
                        os.remove(apk_path)
                    os.rename(os.path.join(output_dir, apk_name), apk_path)
                else:
                    apk_path = os.path.join(output_dir, apk_name)
                return apk_path
            else:
                raise cocos.CCPluginError(MultiLanguage.get_string('COMPILE_ERROR_NOT_SPECIFY_OUTPUT'),
                                          cocos.CCPluginError.ERROR_WRONG_ARGS)

    def _gather_sign_info(self):
        user_cfg = {}
        # get the path of keystore file
        while True:
            inputed = self._get_user_input(MultiLanguage.get_string('COMPILE_TIP_INPUT_KEYSTORE'))
            inputed = inputed.strip()
            if not os.path.isabs(inputed):
                start_path = os.path.join(self.app_android_root, 'app')
                abs_path = os.path.join(start_path, inputed)
            else:
                abs_path = inputed

            if os.path.isfile(abs_path):
                user_cfg[self.key_store_str] = inputed.replace('\\', '/')
                break
            else:
                cocos.Logging.warning(MultiLanguage.get_string('COMPILE_INFO_NOT_A_FILE'))

        # get the alias of keystore file
        user_cfg[self.key_alias_str] = self._get_user_input(MultiLanguage.get_string('COMPILE_TIP_INPUT_ALIAS'))

        # get the keystore password
        user_cfg[self.key_store_pass_str] = self._get_user_input(MultiLanguage.get_string('COMPILE_TIP_INPUT_KEY_PASS'))

        # get the alias password
        user_cfg[self.key_alias_pass_str] = self._get_user_input(MultiLanguage.get_string('COMPILE_TIP_INPUT_ALIAS_PASS'))

        # write the config into ant.properties
        self._write_sign_properties(user_cfg)

    def _get_user_input(self, tip_msg):
        cocos.Logging.warning(tip_msg)
        ret = None
        while True:
            ret = raw_input()
            break

        return ret

    def get_apk_info(self):
        manifest_path = os.path.join(self.app_android_root, 'app')
        gradle_cfg_path = os.path.join(manifest_path, 'build.gradle')
        package = None
        if os.path.isfile(gradle_cfg_path):
            # get package name from build.gradle
            f = open(gradle_cfg_path)
            for line in f.readlines():
                line_str = line.strip()
                pattern = r'applicationId[ \t]+"(.*)"'
                match = re.match(pattern, line_str)
                if match:
                    package = match.group(1)
                    break
        if package is None:
            # get package name from AndroidManifest.xml
            package = self._xml_attr(manifest_path, 'AndroidManifest.xml', 'manifest', 'package')

        activity_name = self._xml_attr(manifest_path, 'AndroidManifest.xml', 'activity', 'android:name')
        if activity_name.startswith('.'):
            activity = package + activity_name
        else:
            activity = activity_name
        ret = (package, activity)

        return ret
