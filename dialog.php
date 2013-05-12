<form>
    <label>SurroundWith</label>
	<hr>
    <table>
        <?php
            $infoStr    = file_get_contents("plugin.json");
            $info       = json_decode($infoStr, true);
            printLine("Author:", $info[0]['author']);
            printLine("Date", '12.05.2013');
            printLine("Version:", $info[0]['version']);
        ?>
        <tr>
            <td>Website:</td>
            <td><a href="http://www.andr3as.bplaced.net/surroundWith" style="color: white">andr3as.bplaced.net/surroundWith</a></td>
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
        </tr>
        <?php
            if (isset($_GET['os'])) {
                $os     = $_GET['os'];
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
            }
            else {
                echo '
                    <tr>
                        <th colspan="2">Error</th>
                    </tr>
                ';
            }
            function printLine($name, $key) {
                echo "
                    <tr>
                        <td>$name</td><td>$key</td>
                    </tr>
                ";
            }
        ?>
    </table>
    <?php
        echo '<button onclick="codiad.modal.unload();return false;">Close</button>';
    ?>
</form>