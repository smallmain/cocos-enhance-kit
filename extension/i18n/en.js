module.exports = {
    'COCOS_CREATE_EXTENSION': 'Create a new extension...',
    'primary_menu': 'Enhance Kit Manage...',
    'settings_menu': 'Enhance Kit Settings...',
    'install_menu': 'Install...',
    'info_menu': 'Print Infomation',
    'uninstall_menu': 'Uninstall',
    'last_menu': 'Install Latest Version',
    'other_menu': 'Install Other Version...',
    'doc_menu': 'Document',
    'website_menu': 'Official Website',
    'github_menu': 'Github',
    'info_title': 'Cocos Enhance Kit Information',
    'info_title2': 'Installed Enhance Kit Information',
    'engine_version_title': 'Current Engine Version:',
    'error_engine_version_not_support': 'The current engine version does not support install',
    'support_version_title': 'Supported install versions:',
    'not_install': 'Please install Enhance Kit first.',
    'version_not_2_0': 'The installed Enhance Kit version must be >= 2.0.0 to support the settings panel.',
    'error_use_global': 'The project\'s custom engine is using global configuration, so the installed Enhance Kit information cannot be read.',
    'uninstall': 'Not Installed',
    'install_success': 'Installation Successful',
    'install_failed': 'Installation Failed',
    'uninstall_success': 'Uninstallation Successful',
    'uninstall_failed': 'Uninstallation Failed, Please Retry',
    'not_backup': 'Uninstallation failed due to missing backup. Please reinstall the engine to uninstall.',
    'restart_tip': 'Installation successful. Please restart the editor to take effect.',
    'failed_tip': 'Installation failed. Please check the error and retry.',
    'restart_tip2': 'Uninstallation successful. Please restart the editor to take effect.',
    'failed_tip2': 'Uninstallation failed. Please check the error and retry.',
    'uninstalling': 'Uninstalling the currently installed Enhance Kit. Please do not operate...',
    'use_global_tip': 'The project\'s custom engine is using global configuration, so it cannot be automatically modified. Please manually restore the global configuration.',
    'skip': 'Does not exist, installation skipped',
    'thank': 'Thank you for supporting the Cocos Enhance Kit open-source project.',
    'settings_title': 'Enhance Kit Settings',
    'unsupport_version_1': 'Enhance Kit version ',
    'unsupport_version_2': ' cannot be installed on this engine version',
    'check_version_prefix': 'Checking the Enhance Kit directory, version ',
    'install_version_prefix': 'Installing the Enhance Kit, version ',
    'dont_action': ', please do not operate...',
    'tip1': 'If there are issues with automatic downloading or extraction failures, please retry several times.',
    'tip2': 'If multiple retries fail, you can manually download the zip file from the following website and place it in the ',
    'tip3': ' directory for extraction.',
    'no_version': 'The local version of the Enhance Kit does not exist. Starting the download...',
    'downloading': 'Downloading...',
    'delete_dir_ing': 'Deleting old directory...',
    'unziping': 'Unzipping...',
    'unzip_failed': 'Unzipping failed. The zip file may be corrupted. The zip file has been deleted. Please try again.',
    'loading': 'Loading...',
    'thread_not_right_workers_dir': 'You have enabled the multi-threading feature of the Enhance Kit, but the correct workers directory and game.json field have not been detected. Please reinstall the Enhance Kit. For details, please refer to the documentation: https://smallmain.github.io/cocos-enhance-kit/docs/user-guide/multithread/thread-intro#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9',
    'thread_need_delete_files': 'You have disabled the multi-threading feature of the community edition. You can manually delete related files to reduce the package size of the WeChat Mini Game. For more details, please refer to the documentation: https://smallmain.github.io/cocos-enhance-kit/docs/user-guide/multithread/thread-intro#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9',
    'thread_title': 'Multi-threading Support',
    'thread_desc': 'This feature is only valid on the WeChat Mini Game platform.',
    'thread_desc2': 'Please note that the following settings are global settings, and any changes will affect all projects. All settings will be lost after reinstalling, upgrading, or uninstalling the Enhance Kit.',
    'thread_debug': 'Debug Mode',
    'thread_debug_desc': 'When enabled, detailed logs will be output for debugging, which may significantly reduce performance.',
    'thread_custom': 'Project multithreading extension',
    'thread_custom_desc': 'This will activate the multithreading extension in the project\'s worker directory.',
    'thread_http': 'Multi-threaded XMLHttpRequest',
    'thread_http_desc': 'When enabled, XMLHttpRequest will be moved to a thread for execution, because there is a data roundtrip time, please actually test whether there is an improvement in performance.',
    'thread_asset_pipeline': 'Multi-threaded Asset Pipeline',
    'thread_asset_pipeline_desc': 'When enabled, the asset pipeline will be executed in a separate thread, reducing stuttering caused by resource downloading, caching, and loading.',
    'thread_audio_system': 'Multi-threaded Audio System',
    'thread_audio_system_desc': 'When enabled, time-consuming audio operations will be executed in a separate thread, reducing stuttering caused by audio API calls.',
    'thread_audio_sync': 'Property Sync Interval (milliseconds)',
    'thread_audio_sync_desc': 'How often the properties of audio instances (playback progress, total duration, etc.) are synchronized from the worker thread to the main thread. Too frequent updates may impact performance.',
    'thread_scheduler': 'Thread Communication Scheduler',
    'thread_scheduler_desc': 'When enabled, multiple data communications will be bundled and sent together, which may reduce performance overhead caused by frequent communications.',
    'thread_compile_custom_thread_menu': 'Recompile the multithreading extension',
    'thread_create_custom_thread_menu': 'Project multithreading extension',
    'thread_custom_not_exists_1': 'You have the Enhance Kit project multithreading extension enabled, but there is no worker directory in the project, you can create one by clicking on the menu items ',
    'thread_custom_not_exists_2': ' .',
    'create_thread_custom_success': 'The project multithreading extension has been created in the worker directory.',
    'refresh_thread_custom_success': 'The multithreading extension has been recompiled.',
    'create_thread_custom_already_exists': 'The project already exists in the worker directory, just update creator-worker.d.ts to the latest version.',
    'thread_custom_need_delete': 'There is a multithreading extension in the project, you can manually delete the worker directory in the project if it is no longer needed.',
};