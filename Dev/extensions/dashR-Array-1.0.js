/*

dashR Array Extension

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
        name: "array",
        enums: [
            {
                name: "SortDirection",
                values: {
                    ASC: 0,
                    DESC: 1
                }
            }, {
                name: "MoveDirection",
                values: {
                    UP: 0,
                    DOWN: 1
                }
            }
        ],        
        js: {
            by: {
                name: function (a, b) {
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1; //nameA comes first
                    }
                    if (nameA > nameB) {
                        return 1; // nameB comes first
                    }
                    return 0;  // names must be equal                
                },
                title: function (a, b) {
                    var nameA = a.title.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1; //nameA comes first
                    }
                    if (nameA > nameB) {
                        return 1; // nameB comes first
                    }
                    return 0;  // names must be equal
                },
                order: function (a, b) {
                    if ((a.order * 1) < (b.order * 1))
                        return -1;
                    if ((a.order * 1) > (b.order * 1))
                        return 1;
                    return 0;
                },                
                date: function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                }
            },
            sort: function (arr, prop, fnc, dir) {

                dir = dir || SortDirection.ASC;

                function byProp(a, b) {
                    var valueA = a.prop; // ignore upper and lowercase
                    var valueB = b.prop; // ignore upper and lowercase
                    if (valueA < valueB) {
                        return -1; //valueB comes first
                    }
                    if (valueA > valueB) {
                        return 1; // valueB comes first
                    }
                    return 0;  // names must be equal  
                }

                function byPropDesc(a, b) {
                    var valueA = a.prop;
                    var valueB = b.prop;
                    if (valueA > valueB) {
                        return -1;
                    }
                    if (valueA < valueB) {
                        return 1;
                    }
                    return 0;
                }                   

                var indexer = [];
                for (a in arr) {
                    indexer.push({
                        index: a,
                        prop: (fnc == undefined) ? arr[a][prop] : fnc(arr[a][prop])
                    });
                }

                // sort indexer on prop.
                if (arguments.length == 3) {
                    indexer.sort(byProp);
                } else {
                    if (dir == SortDirection.DESC) {
                        indexer.sort(byPropDesc);
                    } else {
                        indexer.sort(byProp);
                    }
                }
                
                var result = [];
                for (i in indexer) {
                    result.push(arr[indexer[i].index]);
                }
                return result;

            },
            find: function (arr, prop, value) {
                // Returns the Object Found or Null if not found
                var obj = null;
                for (a in arr) {
                    if (arr[a][prop] == value) {
                        obj = arr[a];
                        break;
                    }
                }
                return obj;
            },
            contains: function (arr, prop, value) {
                // Returns true or false, if the object is in the array or not.
                var found = false;
                for (a in arr) {
                    if (arr[a][prop] == value) {
                        found = true;
                        break;
                    }
                }
                return found;
            },
            remove: function (items, item) {
                var index = items.indexOf(item);
                if (index != -1)
                    items.splice(index, 1);
                return (items);
            },
            swap: {
                indexes: function (arr, fromIndex, toIndex) {
                    var element = arr[fromIndex];
                    arr.splice(fromIndex, 1);
                    arr.splice(toIndex, 0, element);
                },
                items: function (items, item, direction) {
                    var fromIndex = items.indexOf(item);
                    direction = direction || MoveDirection.UP;

                    if ((fromIndex == 0) && (direction == MoveDirection.UP)) {
                        // cannot move it up.
                        return;
                    }

                    if ((fromIndex == items.length) && (direction == MoveDirection.DOWN)) {
                        // cannot move it down.
                        return;
                    }

                    if (direction == MoveDirection.UP) {
                        this.indexes(items, fromIndex, fromIndex - 1)
                    } else {
                        this.indexes(items, fromIndex, fromIndex + 1)
                    }                    
                },
                prop: function (arr, direction, prop, value) {
                 
                    // move a single item inside the array up or down based on an items property name = value

                    var buffer = arr;

                    direction = direction || MoveDirection.UP;

                    // On run, move the object in the array up or down respectivly.
                    for (var i = 0; i < buffer.length; i++) {
                        if (buffer[i][prop] == value) {

                            var newIndex = (direction === MoveDirection.UP) ? i - 1 : i + 1;

                            // is it out of range? lower than 0 or higher than array.length
                            // then hand back the original array.
                            if (newIndex >= buffer.length || newIndex < 0) {
                                return (arr);
                            }
                            var temp = buffer[i];
                            buffer[i] = buffer[newIndex];
                            buffer[newIndex] = temp;
                            break;
                        }
                    }

                    return (buffer);                    
                    
                }
            },
            move: function (arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
            },
            move_item: function (items, item, direction) {

                var fromIndex = items.indexOf(item);
                var directionUp = (direction.toLowerCase() == 'up')

                if ((fromIndex == 0) && (directionUp)) {
                    // cannot move it up.
                    return;
                }

                if ((fromIndex == items.length) && (!directionUp)) {
                    // cannot move it down.
                    return;
                }

                if (directionUp) {
                    this.move(items, fromIndex, fromIndex - 1)
                } else {
                    this.move(items, fromIndex, fromIndex + 1)
                }

            },
            move_where: function (arr, direction, prop, value) {

                // move a single item inside the array up or down based on an items property name = value

                var buffer = arr;

                // On run, move the object in the array up or down respectivly.
                for (var i = 0; i < buffer.length; i++) {
                    if (buffer[i][prop] == value) {

                        var newIndex = direction === 'up' ? i - 1 : i + 1;

                        // is it out of range? lower than 0 or higher than array.length
                        // then hand back the original array.
                        if (newIndex >= buffer.length || newIndex < 0) {
                            return (arr);
                        }
                        var temp = buffer[i];
                        buffer[i] = buffer[newIndex];
                        buffer[newIndex] = temp;
                        break;
                    }
                }

                return (buffer);

            },            
            duplicates: {
                remove: function (arr) {

                    /*
                        Remove duplicate items from an array
                        (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
                            @param  {Array} arr The array
                            @return {Array}     A new array with duplicates removed
                    */

                    return arr.filter(function (item, index) {
                        return arr.indexOf(item) === index;
                    });
                },
                remove_by_property: function (data, prop) {

                    // https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
                    // https://www.geeksforgeeks.org/how-to-sort-an-array-of-object-by-two-fields-in-javascript/

                    // Declare a new array 
                    var newArray = [];

                    // Declare an empty object 
                    var uniqueObject = {};

                    // Loop for the array elements 
                    for (var i in data) {

                        // Extract the title 
                        objProperty = data[i][prop];

                        // Use the title as the index 
                        uniqueObject[objProperty] = data[i];
                    }

                    // Loop to push unique object into array 
                    for (i in uniqueObject) {
                        newArray.push(uniqueObject[i]);
                    }

                    return (newArray);
                }                
            }           

        }
    });

}