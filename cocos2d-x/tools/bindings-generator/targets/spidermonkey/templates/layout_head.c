\#include "scripting/js-bindings/auto/${out_file}.hpp"
#if $macro_judgement
$macro_judgement
#end if
\#include "scripting/js-bindings/manual/jsb_conversions.hpp"
\#include "scripting/js-bindings/manual/jsb_global.h"
#for header in $headers
    #set include_header = os.path.basename(header)
    #if $replace_headers.has_key(include_header)
\#include "${replace_headers[include_header]}"
    #else
        #set relative = os.path.relpath(header, $search_path)
        #if not '..' in relative
\#include "${relative.replace(os.path.sep, '/')}"
        #else
\#include "${include_header}"
        #end if
    #end if
#end for
#if $cpp_headers
#for header in $cpp_headers
\#include "${header}"
#end for
#end if

