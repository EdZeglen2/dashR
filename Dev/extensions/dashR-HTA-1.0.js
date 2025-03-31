/*

dashR HTA Extension

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

    dashR().addContext({
        name: "hta",
        js: {
            command_line: function (cmdLine) {

                var bDouble = false;
                var line = "";
                var lines = [];

                for (c in cmdLine) {
                    var char = cmdLine[c];
                    if (char == " ") {
                        if (bDouble) {
                            // we hit a space inside a double quote started.
                            line += char;
                        } else {
                            if (line != "") { // if its empty skip it? this could be a problem in the future.
                                lines.push(line);
                            }

                            line = "";
                        }
                    } else {
                        if (char == '"') {
                            if (!bDouble) {
                                bDouble = true;
                            } else {
                                // end
                                bDouble = false;
                            }
                        } else {
                            // some other char
                            line += char;
                        }
                    }
                }

                if (line.length > 0) {
                    lines.push(line);
                }

                // For HTAs the first command line param is the 
                // file name skip it. do not return it.
                var outLines = [];
                for (var l = 1; l < lines.length; l++) {
                    outLines.push(lines[l].trim());
                }

                return (outLines);

            }

        }
    });

}