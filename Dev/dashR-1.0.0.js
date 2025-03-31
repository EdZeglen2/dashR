/*

dashR 

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
(function (window) {

    function dashR_Library() {

        var self = this;

        // default contexts create default functions.

        self.version = {
            name: "dashR JS Library",
            major: 1,
            minor: 0,
            patch: 0,
            number: function () {
                return this.major + "." + this.minor + "." + this.patch;
            },
            date: "30-SEP-2024"
        } 

        self.contexts = [
            {
                name: "app",
                js: {
                    _empty: function () { return; }
                }
            },
            {
                name: "system",
                js: {
                    cmd: function (fileSpec, cmdargs, windowstyle, waitonreturn) {

                        var _windowstyle = 5;
                        var _waitonreturn = false;

                        if (arguments.length > 2)
                            _windowstyle = windowstyle;

                        if (arguments.length > 3)
                            _waitonreturn = waitonreturn;

                        if (_context("file").exists(fileSpec)) {
                            var wShell = new ActiveXObject("wScript.Shell");
                            var tt = wShell.Run('"' + fileSpec + '" "' + cmdargs + '"', _windowstyle, _waitonreturn);
                        }
                    },
                    cmd_ps: function (fileSpec, cmdargs, windowstyle, waitonreturn) {

                        var _windowstyle = 5;
                        var _waitonreturn = false;

                        if (arguments.length > 2)
                            _windowstyle = windowstyle;

                        if (arguments.length > 3)
                            _waitonreturn = waitonreturn;

                        if (_context("file").exists(fileSpec)) {
                            var wShell = new ActiveXObject("wScript.Shell");
                            var tt = wShell.Run('"' + fileSpec + '" ' + cmdargs , _windowstyle, _waitonreturn);
                        }
                    },                    
                    open: function (urlOrFileSpec) {
                        var wShell = new ActiveXObject("WScript.Shell");
                        wShell.run(urlOrFileSpec);
                    }

                }
            },
            {
                name: "json",
                js: {
                    load: function (fileSpec, defObj) {
                        var result = defObj;
                        if (_context("file").exists(fileSpec)) {
                            var fileText = _context("file").load(fileSpec);
                            if (fileText.length > 0) {
                                result = JSON.parse(fileText);
                            }
                        }
                        return result;
                    },
                    save: function (fileSpec, obj) {
                        _context("file").save(fileSpec, JSON.stringify(obj));
                    }
                }
            },
            {
                name: "file",
                js: {
                    fso: new ActiveXObject("Scripting.FileSystemObject"),
                    exists: function (fileSpec) {
                        return (this.fso.FileExists(fileSpec));
                    },
                    get: function (fileSpec) {
                        /*
                            fso.file object properties:

                            .Attributes	
                            .DateCreated	
                            .DateLastAccessed
                            .DateLastModified
                            .Drive	
                            .Name	
                            .ParentFolder	
                            .Path	
                            .ShortName	
                            .ShortPath	
                            .Size	
                            .Type
                            
                        */
                        if (this.exists(fileSpec)) {
                            return (this.fso.GetFile(fileSpec));
                        }
                    },     
                    name: function (fileSpec) {
                        // Just the FileName -- no ext or path.
                        return (this.fso.GetBaseName(fileSpec));
                    },
                    ext: function (fileSpec) {
                        return this.fso.GetExtensionName(fileSpec);
                    },
                    load: function (fileSpec, into, separator) {

                        if (!this.exists(fileSpec)) { return ""; }

                        var ForReading = 1;
                        var text = "";

                        try {

                            var f1 = this.fso.OpenTextFile(fileSpec, ForReading);
                            text = f1.ReadAll();

                            f1.close();

                        } catch (err) {
                            throw new Error("dashR - file.load: " + err);
                        }

                        if (arguments.length == 3) {
                            var temp = text.split(separator);
                            for (i = 0; i < temp.length; i++) {
                                if (temp[i].length > 0)
                                    into.push(temp[i]);
                            }
                        }

                        return (text);                        

                    },
                    save: function (fileSpec, text) {

                        // ADDED TO STOP THE B.O.M. PROBLEMS
                        function cleanString(input) {
                            var output = "";
                            for (var i = 0; i < input.length; i++) {
                                if (input.charCodeAt(i) <= 127) {
                                    output += input.charAt(i);
                                }
                            }
                            return output;
                        }  

                        var f1 = this.fso.CreateTextFile(fileSpec, true);
                        f1.Write(cleanString(text));
                        f1.close();
                    },
                    delete: function (fileSpec) {
                        if (this.fso.FileExists(fileSpec)) {
                            this.fso.DeleteFile(fileSpec);
                        }
                    },
                    copy: function (source, destination, overwrite) {
                        var _overwrite = true;

                        if (arguments.length > 2) {
                            _overwrite = overwrite;
                        }

                        if (this.exists(source)) {
                            this.fso.CopyFile(source, destination, _overwrite);
                        }
                    },     
                    copy_to:function (targetFolder, sourceSpec) {

                        // copies to a folder with the windows progress bar window

                        var FOF_CREATEPROGRESSDLG = 0; // &H0&
                        //var targetFolder = "C:\\Users\\ezegl\\Desktop\\crap";
                        //var sourceSpec = "C:\\Users\\ezegl\\Downloads\\Frasier.2023.S02E03.480p.x264-mSD[EZTVx.to].mkv";
                        //var sourceSpec = "C:\\Users\\ezegl\\Downloads\\*.mkv";

                        var ShellApp = new ActiveXObject("Shell.Application");
                        var objFolder = ShellApp.NameSpace(targetFolder);

                        try {
                            objFolder.CopyHere(sourceSpec, FOF_CREATEPROGRESSDLG);
                        } catch (err) {
                            throw new Error(err);
                        }

                        objFolder = null;
                        ShellApp = null;
                    },    
                    rename: function (fileSpec, newfilename) {
                        if (this.exists(fileSpec)) {
                            console.log(fileSpec + ":" + newfilename)
                            var f1 = this.fso.GetFile(fileSpec);
                            f1.name = newfilename;
                            f1 = null;
                        }
                    },
                    download: function (url, fileSpec, fnDone) {

                        // original VBSCRPT:
                        // dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP")
                        // dim bStrm: Set bStrm = createobject("Adodb.Stream")
                        // xHttp.Open "GET", "http://example.com/someimage.png", False
                        // xHttp.Send

                        // with bStrm
                        //     .type = 1 '//binary
                        //         .open
                        //         .write xHttp.responseBody
                        //             .savetofile "c:\temp\someimage.png", 2 '//overwrite
                        // end with

                        // README: since this HTA runs from my Network f://nastybear I had to add this as a trusted site in IE sec settings.
                        // or you get permission denied / access denied. if you get cross domain error in sec settings misc for the zone allow cross domain

                        var xHttp = new ActiveXObject("Microsoft.XMLHTTP");
                        var bStrm = new ActiveXObject("ADODB.Stream");

                        //xHttp.Open("GET", "http://example.com/someimage.png", false); //url
                        xHttp.open("GET", url, false); //url
                        xHttp.send();

                        bStrm.type = 1 //binary
                        bStrm.open();
                        bStrm.write(xHttp.responseBody);
                        bStrm.savetofile(fileSpec, 2);

                        if (fnDone) {
                            fnDone();
                        }

                    }

                }
            },
            {
                name: "folder",
                js: {
                    fso: new ActiveXObject("Scripting.FileSystemObject"),
                    exists: function (folderSpec) {
                        return (this.fso.FolderExists(folderSpec));
                    },
                    get: function (folderSpec) {
                        return (this.fso.GetFolder(folderSpec));
                    },
                    parent: function (folderSpec) {
                        return (this.fso.GetParentFolderName(folderSpec));
                    },
                    sub_folders: function (folderSpec, into) {
                        if (this.fso.FolderExists(folderSpec)) {

                            var oFolder = this.fso.GetFolder(folderSpec);

                            // Reference the File collection of the Text directory
                            var filecollection = oFolder.SubFolders;

                            // Traverse through the FileCollection using the FOR loop
                            for (var objEnum = new Enumerator(filecollection); !objEnum.atEnd(); objEnum.moveNext()) {
                                var oSubFolder = this.fso.GetFolder(objEnum.item());
                                var folderName = oSubFolder.name; 
                                into.push({
                                    "name": folderName,
                                    "spec": folderSpec + "\\" + folderName
                                });
                            }

                            // Destroy and de-reference enumerator object
                            delete objEnum;
                            objEnum = null;

                            // De-reference FileCollection and Folder object
                            filecollection = null;
                            oFolder = null;
                        }
                    },
                    filesIn: function () {
                        if (this.fso.FolderExists(folderspec)) {

                            var oShell = new ActiveXObject("shell.application");

                            var oFolder = this.fso.GetFolder(folderspec);
                            //var objFolder = oShell.NameSpace(folderspec);

                            // Reference the File collection of the directory
                            var filecollection = oFolder.Files;                            

                            // Traverse through the FileCollection using the FOR loop
                            for (var objEnum = new Enumerator(filecollection); !objEnum.atEnd(); objEnum.moveNext()) {
                                var strFileSpec = objEnum.item();

                                var filename = this.fso.GetFileName(strFileSpec)
                                var filex = this.fso.GetFile(strFileSpec);
                                var folderx = this.fso.GetParentFolderName(strFileSpec);
                                var folder = this.fso.GetFolder(folderx);

                                var obj = {};
                                obj["name"] = filename;
                                obj["spec"] = folderspec + "\\" + filename; // strFileSpec;
                                obj["foldername"] = folder.name;
                                obj["mdate"] = new Date(filex.datelastmodified);
                                obj["ext"] = this.fso.GetExtensionName(folderspec + "\\" + filename);
                                obj["size"] = this.fso.GetFile(folderspec + "\\" + filename).Size;

                                into.push(obj);
                            }

                            // Destroy and de-reference enumerator object
                            delete objEnum;
                            objEnum = null;

                            // De-reference FileCollection and Folder object
                            filecollection = null;
                            oFolder = null;                            
                        }
                    },
                    files: function (folderspec, into) {
                        if (this.fso.FolderExists(folderspec)) {

                            var oShell = new ActiveXObject("shell.application");

                            var oFolder = this.fso.GetFolder(folderspec);
                            var objFolder = oShell.NameSpace(folderspec);

                            // Reference the File collection of the directory
                            var filecollection = oFolder.Files;

                            // Traverse through the FileCollection using the FOR loop
                            for (var objEnum = new Enumerator(filecollection); !objEnum.atEnd(); objEnum.moveNext()) {
                                var strFileSpec = objEnum.item();

                                var filename = this.fso.GetFileName(strFileSpec)
                                var filex = this.fso.GetFile(strFileSpec);
                                var folderx = this.fso.GetParentFolderName(strFileSpec);
                                var folder = this.fso.GetFolder(folderx);

                                var obj = {};
                                obj["name"] = filename;
                                obj["spec"] = folderspec + "\\" + filename; // strFileSpec;
                                obj["foldername"] = folder.name;
                                obj["mdate"] = new Date(filex.datelastmodified);
                                obj["ext"] = this.fso.GetExtensionName(folderspec + "\\" + filename);
                                obj["size"] = this.fso.GetFile(folderspec + "\\" + filename).Size;

                                if (objFolder != null) {
                                //if (1 == 2) {

                                    var objFolderItem = objFolder.ParseName(filename);

                                    // https://stackoverflow.com/questions/22382010/what-options-are-available-for-shell32-folder-getdetailsof
                                    var fileData = objFolder.GetDetailsOf(objFolderItem, 27); // = length

                                    /* 
                                        [0] = Name
                                        [1] = Size
                                        [2] = Item type
                                        [3] = Date modified
                                        [4] = Date created
                                        [5] = Date accessed
                                        [6] = Attributes
                                        [7] = Offline status
                                        [8] = Availability
                                        [9] = Perceived type
                                        [10] = Owner
                                        [11] = Kind
                                        [12] = Date taken
                                        [13] = Contributing artists
                                        [14] = Album
                                        [15] = Year
                                        [16] = Genre
                                        [17] = Conductors
                                        [18] = Tags
                                        [19] = Rating
                                        [20] = Authors
                                        [21] = Title
                                        [22] = Subject
                                        [23] = Categories
                                        [24] = Comments
                                        [25] = Copyright
                                        [26] = #
                                        [27] = Length
                                        [28] = Bit rate
                                        [29] = Protected
                                        [30] = Camera model
                                        [31] = Dimensions
                                        [32] = Camera maker
                                        [33] = Company
                                        [34] = File description
                                        [35] = Program name
                                        [36] = Duration
                                        [37] = Is online
                                        [38] = Is recurring
                                        [39] = Location
                                        [40] = Optional attendee addresses
                                        [41] = Optional attendees
                                        [42] = Organizer address
                                        [43] = Organizer name
                                        [44] = Reminder time
                                        [45] = Required attendee addresses
                                        [46] = Required attendees
                                        [47] = Resources
                                        [48] = Meeting status
                                        [49] = Free/busy status
                                        [50] = Total size
                                        [51] = Account name
                                    */

                                    obj["fileData"] = fileData;
                                }

                                into.push(obj);
                            }

                            // Destroy and de-reference enumerator object
                            delete objEnum;
                            objEnum = null;

                            // De-reference FileCollection and Folder object
                            filecollection = null;
                            oFolder = null;
                        }
                    },
                    traverse: function (path, into) {
                        var subFolders = [];
                        this.files(path, into);
                        this.sub_folders(path, subFolders);
                        for (s in subFolders) {
                            into.push(subFolders[s]);
                            this.files(subFolders[s].spec, into);
                        }
                    },
                    create: function (folderSpec) {
                        if (this.fso.FolderExists(folderSpec)) {
                            alert("Folder already exists: " + folderSpec);
                        } else {
                            this.fso.CreateFolder(folderSpec);
                        }
                    },
                    make: function (folderSpec) {
                        // If it exists create will fail. 
                        // This creates only if it does not exist.
                        if (!this.fso.FolderExists(folderSpec)) {
                            this.fso.CreateFolder(folderSpec);
                        }
                    },  
                    delete: function (folderSpec) {
                        if (this.fso.FolderExists(folderSpec)) {
                            this.fso.DeleteFolder(folderSpec, true);
                        } else {
                            alert("Unable to locate and delete folder: " + folderSpec);
                        }
                    },
                    copy: function (source, destination, overwrite) {
                        var _overwrite = true;
                        if (arguments.length > 2) {
                            _overwrite = overwrite;
                        }
                        this.fso.CopyFolder(source, destination, _overwrite);
                    },
                    copy_to: function (targetFolder, sourceSpec) {
                        
                        // copies a folders "items" to a folder with the windows progress bar window

                        var FOF_CREATEPROGRESSDLG = 0; // &H0&
                        //var targetFolder = "C:\\Users\\ezegl\\Desktop\\crap";
                        //var sourceSpec = "C:\\Users\\ezegl\\Downloads\\Frasier.2023.S02E03.480p.x264-mSD[EZTVx.to].mkv";
                        //var sourceSpec = "C:\\Users\\ezegl\\Downloads\\*.mkv";

                        var ShellApp = new ActiveXObject("Shell.Application");

                        var objFolder = ShellApp.NameSpace(targetFolder);
                        var oSource = ShellApp.NameSpace(sourceSpec);
                        var oFolderItems = oSource.Items();

                        try {
                            objFolder.CopyHere(oFolderItems, FOF_CREATEPROGRESSDLG);
                        } catch (err) {
                            throw new Error(err);
                        }

                        objFolder = null;
                        ShellApp = null;
                    },
                    move_to: function (toMove, moveTo) {
                        
                        // moves a file, or another folder to a folder with progress bar.

                        // from: https://learn.microsoft.com/en-us/windows/win32/shell/folder-movehere

                        // moveTo: must be a folder, not a filename, and it must exist.                

                        var FOF_NOCONFIRMATION = 16;

                        try {

                            if (_context("file").exists(toMove)) {
                                var objShell = new ActiveXObject("Shell.Application");
                                var objFolder = new Object;
                                objFolder = objShell.NameSpace(moveTo);
                                if (objFolder != null) {
                                    objFolder.MoveHere(toMove, FOF_NOCONFIRMATION);
                                } else {
                                    throw new Error("dashR (file.move_to) Folder Not Found: " + moveTo)
                                }
                            } else {
                                throw new Error("dashR (file.move_to) File Not Found: " + toMove)
                            }

                        } catch (err) {
                            throw new Error(err);
                        }
                    },
                    browse: function (startinfolder, dialogtitle) {
                        var returnvalue = null;
                        var usedialogtitle = "Please select a folder ...";
                        if (dialogtitle != null) { usedialogtitle = dialogtitle; }
                        var oShell = new ActiveXObject("Shell.Application");
                        var f = oShell.BrowseForFolder(0, usedialogtitle, 0, startinfolder);
                        if (f != null) { returnvalue = f.Items().Item().path; }
                        return (returnvalue);
                    }
                }
            },
            {
                name: "_shared",
                js: {
                    data: null,
                    folder: "",
                    init: function (folder) {
                        this.folder = folder;
                        var obj = _context("json").load(this.folder + "\\_shared.json", { "_shared": {} });
                        this.data = obj._shared;
                    },
                    value: function (name, value) {
                        if (arguments.length == 0) return this.data;
                        if (arguments.length == 1) {
                            return (this.data[name]);
                        } else {
                            this.data[name] = value;
                            this.save();
                        }                        
                    },
                    save: function () {
                        var obj = {
                            _shared: this.data
                        }
                        _context("json").save(this.folder + "\\_shared.json", obj);
                    }
                }
            },
            {
                name: "string",
                js: {
                    pad: function (text, char, length, direction) {
                        var paddingDirection = "left";
                        if (arguments.length > 3) {
                            // we have direction
                            paddingDirection = direction.toLowerCase();
                        }
                        if (paddingDirection.toLowerCase() == "left") {
                            var s = new String(text);
                            while (s.length < length) s = char + s;
                            return (s);
                        } else {
                            var s = new String(text);
                            while (s.length < length) s = s + char;
                            return (s);
                        }
                    },
                    left : function (str, n) {
                        if (n <= 0)
                            return "";
                        else if (n > String(str).length)
                            return str;
                        else
                            return String(str).substring(0, n);
                    },
                    right: function (str, n) {
                        if (n <= 0)
                            return "";
                        else if (n > String(str).length)
                            return str;
                        else {
                            var iLen = String(str).length;
                            return String(str).substring(iLen, iLen - n);
                        }
                    },
                    proper_case: function (text) {
                        //return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                        if (typeof text !== 'string') return ''
                        return text.replace(/\w\S*/g,
                            function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            }
                        );                        
                    }                    
                }
            },
            {
                name: "path",
                js: {
                    combine: function (arr) {
                        var out = "";
                        for (a in arr) {
                            var text = arr[a].trim();
                            if (text.length > 0) {

                                var first = _context("string").left(text, 1);
                                var last = _context("string").right(text, 1)

                                if (first == "\\") {
                                    text = text.replace(/\\/, "");
                                }

                                if (last == "\\") {
                                    text = text.substr(0, text.length - 1);
                                }

                                text = text.replace(/\//, "");

                                if (a > 0) {
                                    out += "\\" + text;
                                } else {
                                    out = text;
                                }                                
                            }
                        }
                        return out;
                    },
                    relative: function (from, to) {
                        var newSpec = to;
                        var f = from;
                        var temp = newSpec.split("..\\");
                        for (i in temp) {
                            if (temp[i] == "") {
                                f = _context("folder").parent(f);
                            }
                        }
                        return (f + "\\" + temp[temp.length - 1]);
                    },
                    map: function (folder) {
                        
                        // a path set is a collection of file specs you ref by alias.

                        var self = this;
                        self.obj = {};
                        
                        self.for = function (alias, fileSpec) {
                            if (arguments.length == 1) {
                                return this.obj[alias];
                            } else if (arguments.length == 2) {
                                self.obj[alias] = fileSpec                                
                            }                            
                        }

                        return self;
                    }
                }
            }
        ];

        // Internal functions & Objects =======================================

        function basePath(from) {
            return (_context("folder").parent(from).split("///")[1].replace(/\//g, "\\"));
        }

        function baseName(from) {
            var ff = from.split("///");
            return _context("file").name(ff[1]);
        }        

        function add_global_enums(enums) {
            for (e in enums) {
                var name = enums[e].name;
                if (window[name] == undefined) {
                    window[name] = enums[e].values;
                }
            }
        }        

        function Elements() {
            return {
                items: [],
                init: function () {
                    var dashR_els = document.getElementsByTagName("dashR");

                    for (var e = 0; e < dashR_els.length; e++) {
                        del = dashR_els[e];
                        var el = {
                            id: del.id,
                            context: del.getAttribute("context"),
                            name: del.getAttribute("name"),
                            type: del.getAttribute("type"),
                            value: del.getAttribute("value"),
                            obj: undefined
                        }

                        if (_context(el.context)) {
                            el.obj = new _context(el.context)[el.type](el);
                        }

                        this.items.push(el);
                    }

                },
                get: function (name) {
                    var obj = null;
                    for (i in this.items) {
                        if (this.items[i].name == name) {
                            obj = this.items[i].obj;
                            break;
                        }
                    }
                    return obj;
                }
            }
        }        

        function AppObject(config, els) {
            var self = this;

            function Dialogs() {
                var self = this;

                self.items = [];

                self.init = function () {
                    var dlgs = document.getElementsByClassName("dashR-dialog");
                    for (var t = 0; t < dlgs.length; t++) {
                        self.items.push({
                            name: dlgs[t].getAttribute("name"),
                            visible: false,
                            show: function () {
                                this.visible = true;
                            },
                            hide: function () {
                                this.visible = false;
                            }
                        });
                    }
                }

                self.get = function (name) {
                    var d = {
                        name: "empty",
                        visible: false,
                    };
                    for (i in self.items) {
                        if (self.items[i].name == name) {
                            d = self.items[i];
                            break;
                        }

                    }
                    return d;
                }

                self.bind = function (folder, name) {
                    // create a div and insert it? or just it just load the HTML?
                    // dlgs have to be in side the vue app. so tricky.
                    // maybe create a <dialogs> tag at the right place and append all dialogs to id.

                    var d = document.getElementById("dialogs");

                    var styleEl = document.createElement('div');
                    styleEl.id = name;
                    styleEl.setAttribute("name", name);
                    styleEl.setAttribute("src", folder + "\\" + name + ".html");
                    styleEl.setAttribute("v-if", "( (app.dlg) || (app.dialog('" + name + "').visible) )");
                    //styleEl.setAttribute("v-if", " (app.dlg) ");
                    styleEl.className += "dashR-dialog dashR-html";

                    // we cannot add the dialogs now, because the Vue has not loaded yet.

                    d.appendChild(styleEl);

                }

                self.dlgs = function (dlgs) {
                    var dlgFolder = dlgs.folder;
                    // can this also load the dlgs
                    for (d in dlgs.dialogs) {
                        //
                        this.bind(dlgFolder, dlgs.dialogs[d].name);
                    }

                    this.init();
                }
            }     
            
            function Packages() {
                var self = this;

                self.init = function (app, obj) {
                    var packFolder = obj.folder;
                    for (p in obj.packages) {
                        this.import(app, packFolder, obj.packages[p]);
                    }                
                }

                self.import = function (app, packFolder, package) {

                    var folder = app.folder;

                    var name = package.name;
                    var pFolder = package.folder;

                    // the folder for the package
                    var folderSpec = folder + "\\" + packFolder + "\\" + name;

                    // override
                    if (pFolder) {
                        folderSpec = folder + "\\" + pFolder + "\\" + name;
                    }                    

                    // CSS
                    var css = dashR("file").load(folderSpec + "\\css\\" + name + "-min.css")
                    if (css.length > 0) {
                        var styleEl = document.createElement('style');
                        styleEl.innerHTML = css;
                        document.head.appendChild(styleEl);
                    }

                    // JS
                    var js = dashR("file").load(folderSpec + "\\js\\" + name + "-min.js");
                    if (js.length > 0) {
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        var code = js;
                        try {
                            s.appendChild(document.createTextNode(code));
                            document.body.appendChild(s);
                        } catch (e) {
                            s.text = code;
                            document.body.appendChild(s);
                        }
                    }

                    if ((package.type) && (package.type == "vue")) {

                        // HTML?
                        var html = dashR("file").load(folderSpec + "\\html\\" + name + "-template.html");
                        if (html.length > 0) {
                            var s = document.createElement('script');
                            s.id = name + "-template"
                            s.type = 'text/x-template';
                            var code = html;
                            try {
                                s.appendChild(document.createTextNode(code));
                                document.body.appendChild(s);
                            } catch (e) {
                                s.text = code;
                                document.body.appendChild(s);
                            }
                        }

                    } else { 
                        // HTML?
                        var html = dashR("file").load(folderSpec + "\\html\\" + name + "-template.html");
                        if (html.length > 0) {
                            var styleEl = document.createElement('template');
                            styleEl.id = name + "-template"
                            styleEl.className = "dashR-html";
                            styleEl.innerHTML = html;
                            document.body.appendChild(styleEl);
                        }
                    }
                }
            }

            function Settings() {
                return {
                    data: null,
                    folder: "",
                    init: function (folder) {
                        this.folder = folder;
                        this.data = _context("json").load(this.folder + "\\_settings.json", {});
                    },
                    value: function (name, value) {
                        if (arguments.length == 0) return this.data;
                        if (arguments.length == 1) {
                            return this.data[name];
                        } else {
                            this.data[name] = value;
                            this.save();
                        }
                    },
                    save: function () {
                        _context("json").save(this.folder + "\\_settings.json", this.data);
                    }
                }
            }

            function html_page(obj, arr) {
                //console.log(arr.length);
                for (var i = 0; i < arr.length; i++) {
                    var id = arr[i].id;
                    var name = arr[i].getAttribute("name");
                    var src = arr[i].getAttribute("src");
                    var menu = arr[i].getAttribute("data-menu");
                    var text = "";
                    if (src != null) {
                        if (_context("file").exists(obj.folder + "\\" + src)) {
                            text = _context("file").load(obj.folder + "\\" + src);
                        } else {
                            if (_context("file").exists(src)) {
                                text = _context("file").load(src);
                            }
                        }
                    }                    
                    var c = document.getElementById(id);
                    if (text.length > 0) {
                        c.innerHTML = text;
                    }          
                    obj.ui.pages.push({
                        id: id,
                        name: name,
                        text: text,
                        menu: menu
                        
                    });
                }
            }            

            var cfg = (config) ? (config) : {};
            self.sharedLocation = (cfg.sharedLocation) ? (cfg.sharedLocation) : "data";            

            self.folder = "";
            self.fileName = "";

            self.dlg = false; 
            self._dialogs = new Dialogs();
            self._packages = new Packages();
            
            self.settings = new Settings();            
            self.fMap = new _context("path").map();

            self.ui = {
                pages: [],
                id: "",
                showing: "Home",
                show: function (id) {
                    for (p in this.pages) {
                        var page = this.pages[p];
                        var div = document.getElementById(page.id);
                        if (div != null) {

                            if (page.id == id) {
                                div.style.display = "block";
                                div.style.visibility = "visible";
                                this.id = page.id;
                                this.showing = page.name;
                                if (page.menu) {
                                    var menu = document.getElementById(page.menu);
                                    if (menu) {
                                        menu.style.visibility = "visible";
                                    }
                                }
                            } else {
                                div.style.display = "none";
                                div.style.visibility = "hidden";
                                if (page.menu) {
                                    var menu = document.getElementById(page.menu);
                                    if (menu) {
                                        menu.style.visibility = "hidden";
                                    }
                                }
                            }                            

                        }
                
                    }
                },
                checks: {
                    master: function (name) {
                        // get the value and flip all the others.
                        var mstr_checked = $("[name='mstr_" + name + "']").prop("checked");
                        var chk_boxes = $("[name='" + name + "']");
                        $.each(chk_boxes, function (i, e) {
                            $(e).prop("checked", mstr_checked);
                        });

                    },
                    checked: function (name) {
                        var result = [];
                        var checked = $("[name='" + name + "']");
                        $.each(checked, function (i, e) {
                            if ($(e).prop("checked")) {
                                var obj = $(e)["0"]["_value"];
                                result.push(obj);
                            }
                        });
                        return result;
                    }
                }                

            }

            self._elements = null;

            self.init = function (config, els) {

                self._elements = els;

                // it knows where its running from
                self.folder = basePath(window.location);           
                self.fileName = baseName(new String(window.location));

                // the \data folder
                self.data_folder = self.folder + "\\" + self.sharedLocation;

                // When an App Start, load the dashR _shared object.
                _context("_shared").init(self.data_folder);

                self.settings.init(self.data_folder);

                if (config != undefined) {
                    if (config.dlgs != undefined) {
                        self._dialogs.dlgs(config.dlgs);
                    }
                    if (config.enums != undefined) {
                        add_global_enums(config.enums);
                    }
                }
               
            }

            self.load = function (fnDone) {

                // process the packages, if any
                if (cfg != undefined) {
                    if (cfg.pkgs != undefined) {
                        self._packages.init(self, cfg.pkgs);
                    }
                }

                html_page(self, document.getElementsByClassName("dashR-html"));

                // This has to go here bc we can't create elements until all the HTML is included in the page.
                // one of those elements might be a DashR Element
                self._elements.init();

                if (fnDone) {
                    fnDone();
                }                
            }

            self.shared = function (name, value) {
                if (arguments.length == 0) return _context("_shared").data;
                if (arguments.length == 1) {
                    return (_context("_shared").value(name));
                } else {
                    _context("_shared").value(name, value);
                }
            }     
            
            self.dialog = function (name) {
                return self._dialogs.get(name);
            }            

            self.checks = function (name, master) {
                if (master) {
                    return self.ui.checks.master(name);
                } else {
                    return self.ui.checks.checked(name);
                }
            }            

            self.init(config, els);

        }

        self._elements = new Elements();

        var _context = function (context) {

            // undefined == the library itself.
            if (context == undefined) {
                return {
                    addContext: function (newContext) {
                        var exists = false;
                        for (c in self.contexts) {
                            if (self.contexts[c].name == newContext.name) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            self.contexts.push(newContext);
                            if (newContext.enums) {
                                add_global_enums(newContext.enums);
                            }                            
                        } else {
                            throw new Error("dashR Context [ name:" + newContext.name + " ] already exists");
                        }                        
                    },
                    versionInfo: function () {
                        return self.version;
                    }, 
                    newApp: function (config) {
                        return new AppObject(config, self._elements);
                    },
                    el: function (elName) {
                        return self._elements.get(elName);
                    }
                }
            }

            // else find what you asked for by name.
            for (c in self.contexts) {
                if (self.contexts[c].name == context) {
                    return self.contexts[c].js;
                }
            }
        }

        return _context;
    }

    // We need that our library is globally accesible, then we save in the window
    if (typeof (window.dashR) === 'undefined') {
        window.dashR = dashR_Library();
    }

})(window); // We send the window variable withing our function
