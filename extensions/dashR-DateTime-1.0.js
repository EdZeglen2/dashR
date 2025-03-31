/*

dashR Date-Time Extension

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

    /*

        var dateMod = dashR("date");

        console.log( dateMod.part.value( new Date() ));
        console.log( dateMod.part.compare( new Date(), new Date(1900, 1, 1), dateMod.cmpDirection.forward ));

    */
    
    dashR().addContext({
        name: "date",
        enums: [
            {
                name: "DateCompare",
                values: {
                    FORWARD: 1,
                    BACKWARD: -1
                }
            }
        ],
        js: {
            is_date: function (obj) {
                return (Object.prototype.toString.call(obj) === '[object Date]');
            },
            from: function (jsonStrDate) {
                // /Date(1731506129972)/ to a real date.
                return new Date(parseInt(jsonStrDate.substr(6)));
            },
            // text_out: function (text, format) {

            //     switch (format) {
            //         case "day mon dd yyyy": {
            //             var aDate = new Date(parseInt(text.substr(6)));
            //             var year = aDate.getFullYear();
            //             var day = String(aDate).split(year);
            //             return (day[0] + " " + year);
            //         }
            //         case "mm/dd/yyyy hh:mm:ss ampm": {
            //             var dt = (this.is_date(text)) ? text : new Date(text);
            //             var res = "";
            //             res += formatdigits(dt.getMonth() + 1);
            //             res += "/";
            //             res += formatdigits(dt.getDate());
            //             res += "/";
            //             res += formatdigits(dt.getFullYear());
            //             res += " ";
            //             res += formatdigits(dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours());
            //             res += ":";
            //             res += formatdigits(dt.getMinutes());
            //             res += ":";
            //             res += formatdigits(dt.getSeconds());
            //             res += " " + dt.getHours() > 11 ? " PM" : " AM";
            //             return res;
            //         }
            //         default: return text;
            //     }
            // },
            format: function (date, format) {

                function formatdigits(val) {
                    val = val.toString();
                    return val.length == 1 ? "0" + val : val;
                }                

                var jDate = new Date(date);

                var month = jDate.getMonth() + 1;
                var day = jDate.getDate();
                var year = jDate.getFullYear();

                switch (format) {
                    case "mm-dd-yyyy": {
                        return (formatdigits(month) + "-" + formatdigits(day) + "-" + year);
                    }
                    case "mm/dd/yyyy": {
                        return (formatdigits(month) + "/" + formatdigits(day) + "/" + year);
                    }
                    case "mm/dd/yyyy hh:mm:ss ampm": {
                        //var dt = (this.is_date(text)) ? text : new Date(text);
                        var dt = jDate;
                        var res = "";
                        res += formatdigits(dt.getMonth() + 1);
                        res += "/";
                        res += formatdigits(dt.getDate());
                        res += "/";
                        res += formatdigits(dt.getFullYear());
                        res += " ";
                        res += formatdigits(dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours());
                        res += ":";
                        res += formatdigits(dt.getMinutes());
                        res += ":";
                        res += formatdigits(dt.getSeconds());
                        res += " " + dt.getHours() > 11 ? " PM" : " AM";
                        return res;
                    }
                    case "day mon dd yyyy": {
                        //var aDate = new Date(date);
                        //var year = aDate.getFullYear();

                        return (this.part.value(jDate));

                        // alert(jDate);
                        // alert(year);
                        // alert(String(jDate));
                        // var day = String(jDate).split(year);
                        // return (day[0] + " " + year);
                    }                        
                }                    
            },
            part: {
                value: function (date) {
                    return new Date(date).toDateString();
                },
                compare: function (date1, date2, direction) {
                    var dir = 1;
                    var d1 = new Date(date1).toDateString();
                    var d2 = new Date(date2).toDateString();
                    if (arguments.length == 3) {
                        dir = direction;
                    }
                    if (dir == DateCompare.FORWARD) {
                        return (d2 <= d1);
                    } else {
                        if (dir == DateCompare.BACKWARD) {
                            return (d1 <= d2);
                        }                        
                    }
                }
            },
            day: {
                text: function (index) {
                    switch (index) {
                        case 0: return "Sunday";
                        case 1: return "Monday";
                        case 2: return "Tuesday";
                        case 3: return "Wednesday";
                        case 4: return "Thursday";
                        case 5: return "Friday";
                        case 6: return "Saturday";
                    }
                }
            }            
        }
    });    

    dashR().addContext({
        name: "time",
        js: {
            format: function (text, format) {
                var date1;
                var outText = "";

                if (text) {
                    switch (format.toLowerCase()) {
                        case "hh:mm ampm": {
                            date1 = new Date(text);
                            hh = date1.getHours();
                            outText = dashR("string").pad(hh, "0", 2)
                                + ":" + dashR("string").pad(date1.getMinutes(), "0", 2);
                            
                            if (hh < 12) {
                                outText += " AM";
                            } else {
                                outText += " AM";
                            }
                        }
                    }
                }

                return outText;
            },
            parse: function (timestring) {

                /*
    
                time.parse("12:00 AM"); // {hh:  0, mm: 0}
                time.parse("12:00 PM"); // {hh: 12, mm: 0}
                time.parse("12:00PM");  // {hh: 12, mm: 0}
                time.parse("12:00pm");  // {hh: 12, mm: 0}
                time.parse("01:00 PM"); // {hh: 13, mm: 0}
                time.parse("23:00");    // {hh: 23, mm: 0}
    
                */

                var part = timestring.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
                var hh = parseInt(part[1], 10);
                var mm = parseInt(part[2], 10);
                var ap = part[3] ? part[3].toUpperCase() : null;
                if (ap === "AM") {
                    if (hh == 12) {
                        hh = 0;
                    }
                }
                if (ap === "PM") {
                    if (hh != 12) {
                        hh += 12;
                    }
                }
                return { hh: hh, mm: mm };

            },
            diff: function (start, end) {

                // from here: http://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
                // use a constant date (e.g. 2000-01-01) and the desired time to initialize two dates

                var date1 = new Date(2000, 0, 1, start.hh, start.mm); // 9:00 AM
                var date2 = new Date(2000, 0, 1, end.hh, end.mm); // 5:00 PM

                // the following is to handle cases where the times are on the opposite side of
                // midnight e.g. when you want to get the difference between 9:00 PM and 5:00 AM

                if (date2 < date1) {
                    date2.setDate(date2.getDate() + 1);
                }

                var diff = date2 - date1;

                // 28800000 milliseconds (8 hours)

                var msec = diff;
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                msec -= mm * 1000 * 60;
                var ss = Math.floor(msec / 1000);
                msec -= ss * 1000;
                // diff = 28800000 => hh = 8, mm = 0, ss = 0, msec = 0

                return { hh: hh, mm: mm, ss: ss, msec: msec }

            }
        }
    });

}