/*

dashR List Extension

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
        name: "list",
        js: {
            collection: function () {
                // Simulated Collection using a JS Object
                return {
                    keys: {},
                    item: function (key) {
                        return this.keys[key];
                    },
                    add: function (key, value) {
                        if (this.keys[key] == undefined) {
                            this.keys[key] = value;
                        } else {
                            throw new Error("dashR An item already exists in the collection with that key: " + key);
                        }
                    },
                    remove: function (key) {
                        if (this.keys[key]) {
                            delete this.keys[key];
                        }
                    },
                    clear: function () {
                        for (key in this.keys) {
                            this.remove(key);
                        }
                    },
                    exists: function (key) {
                        return (!(this.keys[key] == undefined))
                    },
                    length: function () {
                        return Object.keys(this.keys).length;
                    }
                }
            },
            dictionary: function () {
                // The Built in One.
                return new ActiveXObject("Scripting.Dictionary");
            }
        }
    });

}