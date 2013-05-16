<!--
    Copyright (c) Codiad & Andr3as, distributed
    as-is and without warranty under the MIT License. 
    See [root]/license.md for more information. This information must remain intact.
-->
<form>
    <label>SurroundWith</label>
	<hr>
    <?php
        if (!isset($_GET['type'])) {
            $type = "info";
        } else {
            $type = $_GET['type'];
        }
        if ($type == 'info') {
            echo '<table>';
            $infoStr    = file_get_contents("plugin.json");
            $info       = json_decode($infoStr, true);
            printLine("Author:", $info[0]['author']);
            printLine("Date", '12.05.2013');
            printLine("Version:", $info[0]['version']);
            echo '
                <tr>
                    <td>Website:</td>
                    <td><a href="http://www.andr3as.bplaced.net/SurroundWith" style="color: white">andr3as.bplaced.net/SurroundWith</a></td>
                </tr>
                <tr>
                    <td>Github:</td>
                    <td><a href="http://www.github.com/Andr3as/Codiad-SurroundWith" style="color: white">github.com/Andr3as/Codiad-SurroundWith</a></td>
                </tr>
                <tr>
                    <th colspan="2" style="font-weight: normal">A plugin to add a surround with function to codiad like in Eclipse</th>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    <td><label>Hotkeys</label></td>
                </tr>
                <tr>
                    <td>To add</td>
                    <td>Keys</td>
                </tr>';
            if (isset($_GET['os'])) {
                $os = $_GET['os'];
            }
            else {
                $os = "win";
            }
            if ($os == "lin") {
                $os = "win";
            }
            $keyStr = file_get_contents("keyBindings.json");
            $array  = json_decode($keyStr, true);
            $len    = count($array);
            // Todo - refactor as loop
            for ($i = 0; $i < $len; $i++) {
                printLine($array[$i]["string"], $array[$i]["bindKey"][$os]);
            }
            echo '</table>
                <button onclick="codiad.modal.unload();return false;">Close</button>';
        } else if ($type == "settings") {
            if (isset($_GET['indentType'])) {
                $indentType = $_GET['indentType'];
            } else {
                $indentType = "tab";
            }
            if (isset($_GET['tabWidth'])) {
                $tabWidth = $_GET['tabWidth'];
            } else {
                $tabWidth = 4;
            }
            echo '
                <label>Settings</label>
                <p>Note: These settings are only temporary for this session.<br> For permanent settings edit the settings in init.js.</p>
                <hr>
                <table class="settings">
                    <tr>
                        <td width="1">Indentation:</td>
                        <td>
                            <select class="setting" id="indentType" size="1" tabindex="1">';
                                if ($indentType == "tab") {
                                    pringSelected("Tabs", "Spaces");
                                } else {
                                    pringSelected("Spaces", "Tabs");
                                }
                echo '      </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="1">Tab Width:</td>
                        <td>
                            <select class="setting" id="tabWidth" size="1" tabindex="2">';
                                for ($i = 0; $i <= 10;$i++) {
                                    if ($i == $tabWidth) {
                                        echo "<option selected>$i</option>";
                                    } else {
                                        echo "<option>$i</option>";
                                    }
                                }
            echo '          </select>
                        </td>
                    </tr>
                </table>
                <button onclick="unloadSettings();">Close</button>
                <script>
                    function unloadSettings() {
                        var indentType  = $("#indentType").val();
                        var tabWidth    = $("#tabWidth").val();
                        if (indentType == "Tabs") {
                            codiad.SurroundWith.indentType = "tab";
                        } else {
                            codiad.SurroundWith.indentType = "space";
                        }
                        codiad.SurroundWith.tabWidth = tabWidth;
                        codiad.modal.unload();
                        return false;
                    }
                </script>
            ';
        }
    ?>
</form>

<?php
    function printLine($name, $key) {
        echo "
            <tr>
                <td>$name</td><td>$key</td>
            </tr>
        ";
    }
    function pringSelected($sel, $other) {
        echo "
            <option selected>$sel</option>
            <option>$other</option>
        ";
    }
?>