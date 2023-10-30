cmake_minimum_required(VERSION 3.8)


set(PVMP3SOURCE 
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_normalize.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_alias_reduction.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_crc.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_decode_header.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_decode_huff_cw.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_getbits.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_dequantize_sample.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_framedecoder.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_get_main_data_size.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_get_side_info.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_get_scale_factors.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_mpeg2_get_scale_data.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_mpeg2_get_scale_factors.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_mpeg2_stereo_proc.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_huffman_decoding.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_huffman_parsing.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_tables.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_imdct_synth.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_mdct_6.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_dct_6.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_poly_phase_synthesis.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_equalizer.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_seek_synch.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_stereo_proc.cpp
    ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_reorder.cpp
)


if("${ANDROID_ABI}" MATCHES "armeabi.*")
    message(STATUS "pvmp3dec compile with asm")
    set(PVMP3SOURCE_ASM
        ${CMAKE_CURRENT_LIST_DIR}/src/asm/pvmp3_polyphase_filter_window_gcc.s
        ${CMAKE_CURRENT_LIST_DIR}/src/asm/pvmp3_mdct_18_gcc.s
        ${CMAKE_CURRENT_LIST_DIR}/src/asm/pvmp3_dct_9_gcc.s
        ${CMAKE_CURRENT_LIST_DIR}/src/asm/pvmp3_dct_16_gcc.s
    )
    #set_source_files_properties(${PVMP3SOURCE_ASM} PROPERTIES LANGUAGE ASM)
    set_source_files_properties(${PVMP3SOURCE_ASM} PROPERTIES COMPILE_FLAGS  "-x assembler-with-cpp" )

    list(APPEND PVMP3SOURCE ${PVMP3SOURCE_ASM})
else()
    list(APPEND PVMP3SOURCE
        ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_polyphase_filter_window.cpp
        ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_mdct_18.cpp
        ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_dct_9.cpp
        ${CMAKE_CURRENT_LIST_DIR}/src/pvmp3_dct_16.cpp
    )
endif()

add_library(pvmp3dec ${PVMP3SOURCE})

target_include_directories(pvmp3dec PUBLIC 
    ${CMAKE_CURRENT_LIST_DIR}/src
    ${CMAKE_CURRENT_LIST_DIR}/include
)

if(NOT EXISTS ${CMAKE_CURRENT_BINARY_DIR}/pvmp3dec_tmp_def.h)
    file(WRITE ${CMAKE_CURRENT_BINARY_DIR}/pvmp3dec_tmp_def.h "#pragma once\n#define OSCL_UNUSED_ARG(x) (void)(x)")
endif()

if (NOT NX_WINDOWS)
    target_compile_options(pvmp3dec PRIVATE 
        #-fsanitize=signed-integer-overflow
        -include ${CMAKE_CURRENT_BINARY_DIR}/pvmp3dec_tmp_def.h
       #
    )
endif()
