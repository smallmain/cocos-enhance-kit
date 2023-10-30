cmake_minimum_required(VERSION 3.8)

set(VORIBISIDEC_SOURCE 
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/bitwise.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/codebook.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/dsp.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/floor0.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/floor1.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/floor_lookup.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/framing.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/info.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/mapping0.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/mdct.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/misc.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/res012.c
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo/vorbisfile.c
)


add_library(vorbisidec ${VORIBISIDEC_SOURCE})

set_target_properties(vorbisidec PROPERTIES LANGUAGE C)

target_include_directories(vorbisidec PUBLIC 
    ${CMAKE_CURRENT_LIST_DIR}/Tremolo
)

target_compile_definitions(vorbisidec PRIVATE
    ONLY_C
)
