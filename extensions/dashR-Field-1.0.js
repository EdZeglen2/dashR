/*

dashR field Context

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

===========================================================================================

Created By: ECZ
Created Date: 05/11/2021

Description: Handles Field Validation (without Forms!)

Usage:
    add fv-test to any field to be tested.
    add fv-message="message" to set a custom message.
    add fv-email="true" for email validation.
    add fv-blur="true" for immediate test validation when leaving the field.
    add fv-inside="secionOrTabID" to know where an item is when it fails.
    add fv-date="true" for date validation.
    add required to any required field (text, or checkbox)
    add fv-type="numeric", fv-type="alpha", fv-type="alphanumeric"
    add fv-min="3" to force at least 3 chars.
    add fv-max="10" to force limit at 10 chars.
    add fv-regex="aregexexp" to force a pattern.
    add fv-function="customFunc1" to call a custom global js function (see below)

    // this example tests for dashes in the string.
    function customFunc1(field, value) {
        var isValid = true;
        if (value.indexOf('-') != -1) {
            isValid = false;
        }
        return {
            isInvalid: !isValid,
            field: field,
            message: "Please remove any dashes."
        }
    }

How to show a tab where an error is:

    ... make sure you set the fv-inside="tab10" or whatever it is on each field

    if (self.fv.errorFields.length > 0) {
        var tabId = self.fv.errorFields[0].inside;
        $('#' + tabId).click();
    }

Examples:
    <input type="text" class="form-control" fv-test required fv-email="true" />
    <input type="text" class="form-control" fv-test required fv-min="3" />
    <input type="text" class="form-control" fv-test fv-regex="^\d{3}-?\d{2}-?\d{4}$" fv-message="Enter your SSN with dashes" />

===========================================================================================    

*/

if (typeof (window.dashR) !== 'undefined') {

    dashR().addContext({
        name: "field",
        js: {
            validation: function (scope) {

                function validateEmail(email) {

                    // if its not required, then blank is a valid email address.
                    if (email.length == 0) return true;

                    //var re = /^[^\s@]+@[^\s@]+$/;
                    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    return re.test(email);
                }

                function numbersOnly(text) {
                    var re = /^[0-9-\.]*$/;
                    return re.test(text);
                }

                function alphaOnly(text) {
                    var re = /^[A-Za-z]+$/;
                    return re.test(text);
                }

                function alphaNumericOnly(text) {
                    if (text) {
                        var re = /^\w+$/;
                        return re.test(text);
                    } else {
                        return true;
                    }
                }

                function regexTest(text, exp) {
                    var re = new RegExp(exp);
                    return re.test(text);
                }

                // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
                function isValidDate(dateString) {
                    // First check for the pattern
                    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
                        return false;

                    // Parse the date parts to integers
                    var parts = dateString.split("/");
                    var day = parseInt(parts[1], 10);
                    var month = parseInt(parts[0], 10);
                    var year = parseInt(parts[2], 10);

                    // Check the ranges of month and year
                    if (year < 1000 || year > 3000 || month == 0 || month > 12)
                        return false;

                    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    // Adjust for leap years
                    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                        monthLength[1] = 29;

                    // Check the range of the day
                    return day > 0 && day <= monthLength[month - 1];
                };                

                return {
                    fieldData: [],
                    key: "fv-test",
                    scope: scope,
                    errorFields: [],
                    parsed: false,                    
                    parse: function () {

                        // This locates all the fv-test elements and load them into its head.
                        // if the form was not visible in a modal or tab you must .parse again each time you show it.

                        var element = this;

                        element.fieldData = [];

                        var data;

                        if (element.scope) {
                            data = $('#' + element.scope).find("input[" + element.key + "], textarea[" + element.key + "], select[" + element.key + "]");
                        } else {
                            // any field anywhere.
                            data = $("input[" + element.key + "], textarea[" + element.key + "], select[" + element.key + "]");
                        }

                        $.each(data, function (i, e) {

                            var vField = {
                                element: e,
                                id: $(e).attr("id"),
                                inside: $(e).attr("fv-inside"),
                                type: $(e).attr("fv-type"),
                                regex: $(e).attr("fv-regex"),
                                min: $(e).attr("fv-min"),
                                max: $(e).attr("fv-max"),
                                email: ($(e).attr("fv-email") == "true"),
                                blur: ($(e).attr("fv-blur") == "true"),
                                date: ($(e).attr("fv-date") == "true"),
                                message: ($(e).attr("fv-message") ? $(e).attr("fv-message") : "Please fill out this field"),
                                isRequired: ($(e).attr("required") == "required"),
                                function: $(e).attr("fv-function"),
                                error: "err_" + i
                            };

                            // place the error span just in case.
                            // we only do this once.
                            element.placement(vField);

                            // add it to things to validate.
                            element.fieldData.push(vField);

                            if (vField.blur) {
                                element.add_blur(vField);
                            }
                        });

                        element.parsed = true;

                    },
                    add_blur: function (vField) {

                        var element = this;

                        var el = $(vField.element);

                        // make sure its off first.
                        $(el).off("blur");

                        $(el).on("blur", function () {
                            if (element._validate(vField)) {
                                element.reset(vField)
                            }
                        });

                    },
                    placement: function (vField) {
                        var el = $(vField.element);

                        var error = $('<span id="' + this.scope + "_" + vField.error + '" style="display:none"></span>').text(vField.message);

                        error.addClass("invalid-feedback"); // works

                        // for text, textarea not check boxes.
                        if (el.prop("type") === "checkbox") {
                            error.insertAfter(el.next("label"));
                        } else {
                            error.insertAfter(el);
                        }
                    },
                    validate: function (fnValid, fnInValid) {

                        var isOk = true;

                        if (!this.parsed) {
                            this.parse();
                        }

                        this.errorFields = [];

                        if (this.fieldData.length > 0) {
                            for (var iIndex = 0; iIndex < this.fieldData.length; iIndex++) {
                                var fIsOk = this._validate(this.fieldData[iIndex]);

                                if (!fIsOk) {
                                    this.errorFields.push(this.fieldData[iIndex]);
                                    isOk = false;
                                }

                                // if ((!fIsOk) && (isOk)) {
                                //     isOk = false;
                                //     //break;
                                // }
                            }
                        }

                        if (isOk) {
                            if (fnValid) {
                                fnValid();
                            }
                            return true
                        } else {
                            if (fnInValid) {
                                fnInValid(this.errorFields);
                            }
                            return false;
                        }

                    },
                    _validate: function (vField) {

                        var el = $(vField.element);
                        var value = $(vField.element).val();

                        // 1. Handle Required Fields First.
                        if (vField.isRequired) {

                            if (el.prop("type") === "checkbox") {

                                if (!el.prop("checked")) {
                                    this.message(vField, "Please check this box to proceed.");
                                    this.update_ui(el, false, vField.error);
                                    return false;
                                }
                            } else {
                                // for a text box, is there text?
                                if (!value) {
                                    this.update_ui(el, false, vField.error);
                                    return false;
                                }
                            }
                        }

                        // 2. Handle Min Max
                        if (value.length < vField.min) {
                            this.message(vField, "A minimum of " + vField.min + " characters are required.");
                            this.update_ui(el, false, vField.error);
                            return false;
                        }

                        if (value.length > vField.max) {
                            this.message(vField, "Only " + vField.max + " characters are allowed.");
                            this.update_ui(el, false, vField.error);
                            return false;
                        }

                        // 3. Handle Format Errors (Email, etc);
                        if (vField.email) {
                            if (!validateEmail(value)) {
                                this.message(vField, "Enter a valid Email Address.");
                                this.update_ui(el, false, vField.error);
                                return false;
                            }
                        }

                        // 3A. Handle Date Errors ();
                        if (vField.date) {
                            if (!isValidDate(value)) {
                                this.message(vField, "Enter a valid Date.");
                                this.update_ui(el, false, vField.error);
                                return false;
                            }
                        }

                        // 4. Handle Type Errors (Number Only, etc.)
                        if (vField.type == 'numeric') {
                            if (!numbersOnly(value)) {
                                this.message(vField, "This field is for numbers only.");
                                this.update_ui(el, false, vField.error);
                                return false;
                            }
                        } else {
                            if (vField.type == 'alpha') {
                                if (!alphaOnly(value)) {
                                    this.message(vField, "This field is for letters only.");
                                    this.update_ui(el, false, vField.error);
                                    return false;
                                }
                            } else {
                                if (vField.type == 'alphanumeric') {
                                    if (!alphaNumericOnly(value)) {
                                        this.message(vField, "This field is for letters and numebrs only.");
                                        this.update_ui(el, false, vField.error);
                                        return false;
                                    }
                                }
                            }
                        }

                        // 5. User a JS Function they specified 
                        if (vField.function) {
                            var obj = eval(vField.function + "(vField, value);");
                            if (obj.isInvalid) {
                                this.message(vField, obj.message);
                                this.update_ui(el, false, vField.error);
                                return false;
                            }
                        }

                        // 6. Regex from user
                        if (vField.regex) {
                            if (!regexTest(value, vField.regex)) {
                                this.update_ui(el, false, vField.error);
                                return false;
                            }

                        }

                        this.update_ui(el, true, vField.error);
                        return true;

                    },
                    update_ui: function (el, isValid, errTagId) {
                        if (isValid) {
                            el.addClass("is-valid").removeClass("is-invalid");
                            $('#' + this.scope + "_" + errTagId).css("display", "none");
                        } else {
                            el.addClass("is-invalid").removeClass("is-valid");
                            $('#' + this.scope + "_" + errTagId).css("display", "block");
                        }
                    },
                    message: function (vField, message) {
                        var error = $("#" + this.scope + "_" + vField.error);
                        error.text(message);
                    },
                    reset: function (vField) {
                        if (vField == undefined) {
                            if (this.fieldData.length > 0) {
                                for (var iIndex = 0; iIndex < this.fieldData.length; iIndex++) {
                                    $(this.fieldData[iIndex].element).removeClass("is-invalid").removeClass("is-valid");
                                }
                            }
                        } else {
                            $(vField.element).removeClass("is-invalid").removeClass("is-valid");
                        }
                    }                    
                }
            }
        }
    });

}