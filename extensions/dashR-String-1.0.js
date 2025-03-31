/*

dashR String Extension

The MIT License (MIT)

Copyright (c) 2024 Edward C. Zeglen III

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
if (typeof (window.dashR) !== 'undefined') {

    // This Extends the Built-in "string" Context of dashR with more functions

    dashR("string")["clean"] = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return output;
    }

    dashR("string")["starts_with"] = function (text, find) {
        return text.toLowerCase().lastIndexOf(find.toLowerCase(), 0) === 0;
    }
    
    dashR("string")["ends_with"] = function (text, find) {
        return text.toLowerCase().indexOf(find.toLowerCase(), text.length - find.length) !== -1;
    }    

    // remove below when I am sure nothing is looking for it.
    
    // dashR().addContext({
    //     name: "string-ext",
    //     js: {
    //         clean: function (input) {
    //             var output = "";
    //             for (var i = 0; i < input.length; i++) {
    //                 if (input.charCodeAt(i) <= 127) {
    //                     output += input.charAt(i);
    //                 }
    //             }
    //             return output;
    //         },
    //         starts_with: function (text, find) {
    //             return text.toLowerCase().lastIndexOf(find.toLowerCase(), 0) === 0;
    //         },
    //         ends_with: function (text, find) {
    //             return text.toLowerCase().indexOf(find.toLowerCase(), text.length - find.length) !== -1;
    //         }
    //     }
    // });

}