// Add a custom code object to the "file" Context.
dashR("file")["selector"] = function (el) {
    return {
        el: el,
        template: "file-selector-template",
        exts: [],
        text: "",
        _container: null,
        init: function (value) {
            this.text = (value == undefined) ? "" : value;
            this.bind();
        },
        bind: function () {

            var element = this;

            // locate our container, via its .id
            this._container = document.getElementById(this.el.id);

            // load the invisible template html from that tag.
            var template = document.getElementById(this.template);

            var x = template.innerHTML;
            html = x.replace("fs-textbox", "fs-textbox-" + this.el.id);
            html = html.replace("fs-upload", "fs-upload-" + this.el.id);

            // set it.
            this._container.innerHTML = html;
            $("#fs-textbox-" + this.el.id).val(this.text);

            // events
            $(document).on('change', '.btn-file :file', function () {
                var input = $(this),

                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

                var temp = input.attr('id').split('-');
                var el_index = temp[temp.length - 1];

                if (element.el.id == el_index) {
                    element.text = input.val();
                }

                $("#fs-textbox-" + el_index).val(input.val());

            });

        }
    }
}