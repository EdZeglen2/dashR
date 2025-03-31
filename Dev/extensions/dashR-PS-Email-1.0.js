/*

dashR ps-email Context

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
        name: "email",
        js: {
            message: function (to, from, subject, body, id) {
                var obj = {};

                obj.to = [];
                obj.to.push(to);

                obj.from = from;
                obj.subject = subject;
                obj.body = body;
                obj.isHTML = true;

                obj.attachments = [];

                obj.id = (id != undefined) ? id : "dashR-email";

                return obj;
            },
            config: function (server, userName, passWord) {
                var obj = {};

                obj.server = server;
                obj.username = userName;
                obj.password = passWord;
                obj.port = 587;
                obj.enableSSL = true;
                obj.timeout = 400000;
                obj.ps = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";

                return obj;
            },
            power_shell: {
                send: function (config, message, folder) {

                    // create a text file ...

                    var lines = '[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;\n';

                    lines += '$smtp = new-object Net.Mail.SmtpClient("' + config.server + '", ' + config.port + ');\n';
                    lines += '$smtp.Credentials = New-Object System.Net.NetworkCredential("' + config.username + '", "' + config.password + '");\n';
                    lines += '$smtp.EnableSsl = $' + config.enableSSL + ';\n';
                    lines += '$smtp.Timeout = ' + config.timeout + ';\n';

                    lines += '$Message = new-object Net.Mail.MailMessage\n';
                    lines += '$Message.From = "' + message.from + '"\n';

                    for (i in message.to) {
                        lines += '$Message.To.Add("' + message.to[i] + '");\n';
                    }

                    lines += '$Message.Subject = "' + message.subject + '"\n';
                    lines += '$Message.Body = "' + message.body + '"\n';
                    lines += '$Message.IsBodyHtml = $' + message.isHTML + '\n';

                    for (a in message.attachments) {
                        lines += '$attach_' + a + ' = new-object Net.Mail.Attachment("' + message.attachments[a] + '");\n ';
                        lines += '$message.Attachments.Add($attach_' + a + ');\n';
                    }

                    lines += '$smtp.Send($Message);\n';

                    // save it
                    var fileSpec = folder + "\\" + message.id + ".ps1";
                    dashR("file").save(fileSpec, lines);

                    // run it with powershell.
                    dashR("system").cmd_ps(config.ps, ' -executionpolicy bypass -file "' + fileSpec + '" ', 5, true); // " add -noexit to see errors"

                }
            }
        }
    });

}