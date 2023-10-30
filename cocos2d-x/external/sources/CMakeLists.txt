
set(CC_UNZIP_SOURCES
  ${CMAKE_CURRENT_LIST_DIR}/unzip/crypt.h
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi.h
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi_mem.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi_mem.h
  ${CMAKE_CURRENT_LIST_DIR}/unzip/unzip.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unzip/unzip.h
)



set(CC_TINYDIR_SOURCES
  ${CMAKE_CURRENT_LIST_DIR}/tinyxml2/tinyxml2.cpp
  ${CMAKE_CURRENT_LIST_DIR}/tinyxml2/tinyxml2.h
  ${CMAKE_CURRENT_LIST_DIR}/tinydir/tinydir.h
)

set(CC_UTILS_SOURCES
  ${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTF.c
  ${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTF.h
  ${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTFWrapper.cpp
  ${CMAKE_CURRENT_LIST_DIR}/xxtea/xxtea.cpp
  ${CMAKE_CURRENT_LIST_DIR}/xxtea/xxtea.h
)

set(CC_EXTERNAL_SOURCES)

list(APPEND CC_EXTERNAL_SOURCES
  ${CC_UNZIP_SOURCES}
  ${CC_TINYDIR_SOURCES}
  ${CC_UTILS_SOURCES}
)

list(APPEND CC_EXTERNAL_INCLUDES 
  ${CMAKE_CURRENT_LIST_DIR}/pvmp3dec/include
  ${CMAKE_CURRENT_LIST_DIR}/pvmp3dec/src
)
include(${CMAKE_CURRENT_LIST_DIR}/pvmp3dec/CMakeLists.txt)
include(${CMAKE_CURRENT_LIST_DIR}/tremolo/CMakeLists.txt)

list(APPEND CC_EXTERNAL_LIBS
  pvmp3dec
  vorbisidec
)

list(APPEND CC_EXTERNAL_INCLUDES
  ${CMAKE_CURRENT_LIST_DIR}
)
