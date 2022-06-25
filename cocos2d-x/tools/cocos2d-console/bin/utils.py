#!/usr/bin/python
#-*- coding: utf-8 -*-

import os
import sys
import shutil
import cocos
import re
import zipfile

VS_VERSION_MAP = {
    2012 : "11.0",
    2013 : "12.0",
    2015 : "14.0",
    2017 : "15.0"
}

def get_msbuild_path(vs_version):
    if cocos.os_is_win32():
        import _winreg
    else:
        return None

    if isinstance(vs_version, int):
        # The value of vs_version is int. such as : 2017
        if vs_version in VS_VERSION_MAP.keys():
            vs_ver = VS_VERSION_MAP[vs_version]
        else:
            # not supported VS version
            return None
    elif isinstance(vs_version, str):
        # The value of vs_version is string. such as: "12.0", "14.0"
        vs_ver = vs_version
    else:
        return None

    # If the system is 64bit, find VS in both 32bit & 64bit registry
    # If the system is 32bit, only find VS in 32bit registry
    if cocos.os_is_32bit_windows():
        reg_flag_list = [ _winreg.KEY_WOW64_32KEY ]
    else:
        reg_flag_list = [ _winreg.KEY_WOW64_64KEY, _winreg.KEY_WOW64_32KEY ]

    # Find VS path
    msbuild_path = None
    for reg_flag in reg_flag_list:
        try:
            vs = _winreg.OpenKey(
                _winreg.HKEY_LOCAL_MACHINE,
                r"SOFTWARE\Microsoft\MSBuild\ToolsVersions\%s" % vs_ver,
                0,
                _winreg.KEY_READ | reg_flag
            )
            msbuild_path, type = _winreg.QueryValueEx(vs, 'MSBuildToolsPath')
        except:
            continue

        if msbuild_path is not None:
            msbuild_path = os.path.join(msbuild_path, "MSBuild.exe")
            if os.path.exists(msbuild_path):
                break
            else:
                msbuild_path = None

    return msbuild_path

def get_devenv_path(vs_version):
    if cocos.os_is_win32():
        import _winreg
    else:
        return None

    if isinstance(vs_version, int):
        # The value of vs_version is int. such as : 2017
        if vs_version in VS_VERSION_MAP.keys():
            vs_ver = VS_VERSION_MAP[vs_version]
        else:
            # not supported VS version
            return None
    elif isinstance(vs_version, str):
        # The value of vs_version is string. such as: "12.0", "14.0"
        vs_ver = vs_version
    else:
        return None

    # If the system is 64bit, find VS in both 32bit & 64bit registry
    # If the system is 32bit, only find VS in 32bit registry
    if cocos.os_is_32bit_windows():
        reg_flag_list = [ _winreg.KEY_WOW64_32KEY ]
    else:
        reg_flag_list = [ _winreg.KEY_WOW64_64KEY, _winreg.KEY_WOW64_32KEY ]

    devenv_path = None
    for reg_flag in reg_flag_list:
        try:
            vs = _winreg.OpenKey(
                _winreg.HKEY_LOCAL_MACHINE,
                r"SOFTWARE\Microsoft\VisualStudio",
                0,
                _winreg.KEY_READ | reg_flag
            )
        except:
            continue

        # find specified VS
        try:
            key = _winreg.OpenKey(vs, r"SxS\VS7")
            devenv_path, type = _winreg.QueryValueEx(key, vs_ver)
        except:
            pass

        if devenv_path is not None:
            devenv_path = os.path.join(devenv_path, "Common7", "IDE", "devenv.com")
            if os.path.exists(devenv_path):
                break
            else:
                devenv_path = None

    return devenv_path

def get_vs_versions():
    # Get the VS versions
    ret = []
    if cocos.os_is_win32():
        import _winreg
    else:
        return ret

    # If the system is 64bit, find VS in both 32bit & 64bit registry
    # If the system is 32bit, only find VS in 32bit registry
    if cocos.os_is_32bit_windows():
        reg_flag_list = [ _winreg.KEY_WOW64_32KEY ]
    else:
        reg_flag_list = [ _winreg.KEY_WOW64_64KEY, _winreg.KEY_WOW64_32KEY ]

    version_pattern = re.compile(r'(\d+)\.(\d+)')
    for reg_flag in reg_flag_list:
        try:
            vs = _winreg.OpenKey(
                _winreg.HKEY_LOCAL_MACHINE,
                r"SOFTWARE\Microsoft\VisualStudio",
                0,
                _winreg.KEY_READ | reg_flag
            )
        except:
            continue

        i = 0
        while True:
            # enum the keys in vs reg
            try:
                version = _winreg.EnumKey(vs, i)
            except:
                break
            i += 1

            match = re.match(version_pattern, version)
            if match is None:
                continue

            ver_str = '%s.%s' % (match.group(1), match.group(2))
            if ver_str not in ret:
                ret.append(ver_str)

    return ret

def get_newest_msbuild(min_ver=None):
    versions = get_vs_versions()

    min_ver_float = 0.0
    if isinstance(min_ver, str):
        # value of min_ver is string. such as : "12.0", "14.0"
        min_ver_float = float(min_ver)
    elif isinstance(min_ver, int) and min_ver in VS_VERSION_MAP.keys():
        # value of min_ver is int. such as : 2017
        min_ver_float = float(VS_VERSION_MAP[min_ver])

    find_ver = None
    find_path = None
    for v in versions:
        cur_v = float(v)
        if cur_v < min_ver_float:
            continue

        v_path = get_msbuild_path(v)
        if v_path is not None:
            if (find_ver is None) or (cur_v > find_ver):
                find_ver = cur_v
                find_path = v_path

    return find_path

def get_newest_devenv(min_ver=None):
    versions = get_vs_versions()

    min_ver_float = 0.0
    if isinstance(min_ver, str):
        # value of min_ver is string. such as : "12.0", "14.0"
        min_ver_float = float(min_ver)
    elif isinstance(min_ver, int) and min_ver in VS_VERSION_MAP.keys():
        # value of min_ver is int. such as : 2017
        min_ver_float = float(VS_VERSION_MAP[min_ver])

    find_ver = None
    find_path = None
    for v in versions:
        cur_v = float(v)
        if cur_v < min_ver_float:
            continue

        v_path = get_devenv_path(v)
        if v_path is not None:
            if (find_ver is None) or (cur_v > find_ver):
                find_ver = cur_v
                find_path = v_path

    if min_ver_float > 0 and find_ver > min_ver_float:
        need_upgrade = True
    else:
        need_upgrade = False

    return (need_upgrade, find_path)

def rmdir(folder):
    if os.path.exists(folder):
        if sys.platform == 'win32':
            cocos.CMDRunner.run_cmd("rd /s/q \"%s\"" % folder, verbose=True)
        else:
            shutil.rmtree(folder)

VERSION_FILE_PATH = 'cocos/cocos2d.cpp'
VERSION_PATTERN = r".*return[ \t]+\"(.*)\";"
def get_engine_version(engine_path):
    ret = None

    try:
        version_file = os.path.join(engine_path, VERSION_FILE_PATH)
        if os.path.isfile(version_file):
            f = open(version_file)
            for line in f.readlines():
                match = re.match(VERSION_PATTERN, line)
                if match:
                    ret = match.group(1)
                    break
            f.close()
    except:
        pass

    return ret

def un_zip(file_name, output_dir):
    """unzip zip file into output_dir"""
    zip_file = zipfile.ZipFile(file_name)
    for names in zip_file.namelist():
        zip_file.extract(names, output_dir)  
    zip_file.close()

class ExtendEnv(object):
    extend_env = {}

    @classmethod
    def parse_extend_env(cls, env):
        env_list = env.split(';')
        for item in env_list:
            index = item.find('=')
            if index > 0:
                key = item[:index]
                value = item[index+1:]
                cls.extend_env[key] = value

    @classmethod
    def get_extend_env_value(cls, key):
        if (cls.extend_env.has_key(key)):
            return cls.extend_env[key]
        else:
            return None

    @classmethod
    def get_extend_env_str(cls):
        env_list = []
        for item in cls.extend_env:
            env_list.append("%s=%s" % (item, cls.extend_env[item]))

        return ';'.join(env_list)
