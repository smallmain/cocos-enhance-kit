set(platform_name ohos)
set(platform_spec_path openharmony/${OHOS_ARCH})
set(platform_spec_path "${CMAKE_CURRENT_LIST_DIR}/${platform_spec_path}")

set(CC_EXTERNAL_LIBS)
set(CC_EXTERNAL_INCLUDES ${CMAKE_CURRENT_LIST_DIR}/sources)

set(CC_EXTERNAL_PRIVATE_INCLUDES)
set(CC_EXTERNAL_PRIVATE_DEFINITIONS)

list(APPEND CC_EXTERNAL_PRIVATE_DEFINITIONS
    TBB_USE_EXCEPTIONS=0 # no rtti for now
)
MESSAGE(STATUS "platform path: ${platform_spec_path}")
include(${CMAKE_CURRENT_LIST_DIR}/sources/CMakeLists.txt)
include(${CMAKE_CURRENT_LIST_DIR}/openharmony/CMakeLists.txt)
