<?php
$file = $_GET['f'];

function down_file($filename,$allowDownExt=array ('jpg','jpeg','gif', 'rar','zip','png','txt','html')) {
    // Check if file exist and readable
    if(!is_file($filename) && is_readable($filename)) {
        return false;
    }

    // Get the extention of the file
    $fileext=strtolower(pathinfo($filename,PATHINFO_EXTENSION));

    // Check if the file type is in the allowed array. 
    if(!in_array($fileext,$allowDownExt)) {
        return false;
    }

    // Set the time limit to unlimited
    set_time_limit(0);

    // Download header. 
    header('content-type:application/octet-stream');
    header('Accept-Ranges:bytes');

    // Get the size of the file. 
    $filesize=filesize($filename);

    // Pass the size to browser
    header('Accept-Length:'.$filesize);
    header('content-disposition:attachment;filename='.basename($filename));

    // For large files. Set the limit of each transfer to 4k
    $read_buffer=4096;
    $handle=fopen($filename, 'rb');
    // Sum of all the buffer.
    $sum_buffer=0;

    // Keep reading untill the end of the file.
    while(!feof($handle) && $sum_buffer<$filesize) {       
        echo fread($handle,$read_buffer);
        $sum_buffer+=$read_buffer;
    }

    // close file. 
    fclose($handle);
       // delete file
    unlink($filename);
    exit;
}

down_file($file);
