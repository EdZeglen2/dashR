dashR().addContext({
    name: "icons",
    js: {
        selector: function (el) {
            return {
                el: el,
                items: [],
                index: -1,
                selected: null,
                folder: "",
                _container: null,
                _selectbox: null,
                _dropdown: null,
                init: function (folder) {
                    this.folder = folder;
                },
                bind: function () {
                    // bind updates the elements inner HTML to be the tags needed for the UI
                    // and binds events -- it does nothing else, does not load data.

                    var element = this;
                    var result = "ok";

                    try {

                        element._container = document.getElementById(this.el.id);

                        // Add a Div for the UI.
                        element._selectbox = document.createElement('div');
                        element._selectbox.className = "custom-selector-selected";
                        element._selectbox.id = element.el.id + "-select";

                        // Add a hidden Div for the Drop Down.
                        element._dropdown = document.createElement('div');
                        element._dropdown.className = "custom-selector-drop";
                        element._dropdown.id = element.el.id + "-box";

                        // Clear the inner HTML and put in the two new Divs
                        element._container.innerHTML = "";
                        element._container.appendChild(element._selectbox);
                        element._container.appendChild(element._dropdown);

                        // Events for later.
                        element._selectbox.onclick = function () {
                            element.show();
                        };

                        element._selectbox.addEventListener('click', function (e) {
                            e.stopPropagation();
                        });

                        window.addEventListener('click', function () {
                            element.hide();
                        });

                        document.addEventListener("keypress", function (e) {
                            if (element._dropdown.style.display == "block") {
                                element.scroll_to(e.key);
                            }
                        });

                    } catch (err) {
                        result = err;
                    }

                    return result;

                },
                show: function () {
                    this._dropdown.style.display = "block";
                    this.scroll();
                },
                hide: function () {
                    this._dropdown.style.display = "none";
                },
                scroll_to: function (letter) {

                    // locate the first item with that letter and scroll down to it with _VIEW

                    var found = 0;
                    letter = letter.toUpperCase();

                    for (var t = 0; t < this.items.length; t++) {
                        var item = this.items[t].fileName.toUpperCase();
                        if (dashR("string").starts_with(item, letter)) {
                            found = t;
                            break;
                        }
                    }

                    if (found) {
                        this.index = found;
                        this.selected = this.items[this.index];
                        this._dropdown.scrollTop = 0;
                        this.scroll();
                    }
                },
                scroll: function () {
                    var element = this;
                    Vue.nextTick(function () {
                        element._dropdown.scrollTop += (element.index * (48 + 6));
                    });
                },
                data: function (data) {

                    // clear
                    this._dropdown.innerHTML = "";
                
                    // copy that data to us.
                    this.items = data;

                    // populate the drop down
                    for (d in data) {
                        this.populate(d, data[d]);
                    }

                    // select the first item by default
                    this.value(0);

                },
                populate: function (index, item) {
                    // adds a wrapped item into the drop down for picking.
                    this._dropdown.appendChild(this.ui_list_item(index, item));
                },
                select: function (prop, value) {
                    var found = false;
                    for (d in this.items) {
                        if (this.items[d][prop].toLowerCase() == value.toLowerCase()) {
                            found = true;
                            this.value(d);
                            break;
                        }
                    }

                    if (!found) {
                        this.value(0);
                    }
                },
                clicked: function (index) {
                    this.value(index);
                },
                value: function (index) {

                    this.index = index;
                    this.selected = this.items[index];

                    this._selectbox.innerHTML = "";
                    this._selectbox.appendChild(this.ui_list_item(this.index, this.selected));

                },
                ui_list_item: function (index, item) {

                    var element = this;

                    // New Wrapper
                    var wrapper = document.createElement("div");

                    // Properties
                    wrapper.style.display = "block";
                    wrapper.style.padding = "3px";
                    wrapper.className = "custom-selector-option";
                    wrapper.addEventListener('click', function () { element.clicked(index) });
                    wrapper.id = "cs_option_" + index;

                    // An Image
                    var elImage = document.createElement("img");
                    elImage.src = this.folder + "\\" + item.fileName; // item.spec;
                    elImage.style.cssText = "width:48px;height:48px;";

                    // Append into Wrapper
                    wrapper.appendChild(elImage);

                    // Text
                    var elText = document.createElement("span");
                    elText.innerHTML = item.name;
                    elText.style.cssText = "padding-left:6px;";

                    // Append into Wrapper
                    wrapper.appendChild(elText);

                    return wrapper;

                }

            }
        }
    }
});