<?php
/* Downlaod function, get files array from js and make zip file. 
 *
 *
 */
set_time_limit(0);
ini_set('memory_limit', '512M');
ini_set('date.timezone','US/Eastern');
function create_zip($files = array(),$destination = 'tmp.zip') {
	$valid_files = array();
        $absent_files = "";
        // check if files exist
        if(is_array($files)) {
	        foreach($files as $file) {
                        if(file_exists($file)) {
				$valid_files[] = $file;
                        } else {
			        $absent_files .= ", ". $file;
			}
                }
        }

        // zip the files
        if(count($valid_files)) {
                $overwrite = false;
                // Create new file if not exist. Or rewrite. 
                $zip = new ZipArchive();
                if($zip->open($destination, ZIPARCHIVE::CREATE) !== true) {
                  echo "Failed to create zip!";
                  return false;
                }

		$user_IP = ($_SERVER["HTTP_VIA"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : $_SERVER["REMOTE_ADDR"];
                $user_IP = ($user_IP) ? $user_IP : $_SERVER["REMOTE_ADDR"]; 
                $file = "log/download_log_".date("d-m-Y").".txt"; 
                $content = date("d-m-Y H:i:s")."---".implode(" ** ",$valid_files). "  IP->".$user_IP."\n"; 
                $log_file = fopen($file, "a+"); 
                fwrite($log_file, $content); 
                fclose($log_file); 
                
		// Add files to zip
                foreach($valid_files as $file) {
                        // keep the names.
                        $zip->addFile($file,$file);
                }

                // finish adding
                $zip->close();
 
               // download zip
	//	Header("Location:$destination"); 
		Header("Location:download.php?f=$destination"); 
        }else{
                return false;
        }
}

function generateRandomString($length = 10) { 
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    $randomString = ''; 
    for ($i = 0; $i < $length; $i++) { 
        $randomString .= $characters[rand(0, strlen($characters) - 1)]; 
    } 
    return $randomString; 
}

$links = $_POST;
$name = generateRandomString();
create_zip($links, 'download/simulations-ccrg-'.$name.'.zip');


?>
