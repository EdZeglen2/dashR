/*

dashR Unique Extension

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
        name: "unique",
        js: {
            GUID: function (brackets) {
                var tl = new ActiveXObject("Scriptlet.TypeLib");
                var g = tl.Guid;
                if (arguments.length = 1) {
                    if (brackets == false) {
                        g = g.replace(/\{/g, "");
                        g = g.replace(/\}/g, "");
                    }
                }
                return (g);
            },
            from: {
                math: function () {
                    return "id" + Math.random().toString(16).slice(2);
                },
                now: function () {
                    return Date.now().toString(36) + Math.random().toString(36).substr(2);
                },
                time: function () {
                    return 'id' + (new Date()).getTime();
                },
                text: function (text) {
                    var dashed = text.replace(new RegExp(" ", "g"), "-");

                    var today = new Date();
                    var mon = today.getMonth() + 1;
                    var day = today.getDate();
                    var year = today.getFullYear();

                    var dateCode = Boltz.pad(mon, "0", 2)
                        + Boltz.pad(day, "0", 2)
                        + year;

                    var hour = today.getHours();
                    var min = today.getMinutes();
                    var sec = today.getSeconds();

                    var timeCode = Boltz.pad(hour, "0", 2)
                        + Boltz.pad(min, "0", 2)
                        + Boltz.pad(sec, "0", 2)

                    return (dashed + "-" + dateCode + "-" + timeCode);
                }
            }
        }
    });

}