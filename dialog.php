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
            printLine("Date", '18.05.2013');
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
                    <th colspan="2" style="font-weight: normal">A plugin to add a \'surround with\' ability to codiad like in Eclipse</th>
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
?>