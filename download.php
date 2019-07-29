<?php
$imgs[] = 'http://demo.pic.com/column_f/large/IMG_Af8P_15.jpg';
$imgs[] = 'http://demo.pic.com/column_f/large/IMG_l89P_08.jpg';

$filename = 'tmp.zip';

$zip = new ZipArchive();
$zip->open($filename, ZipArchive::OVERWRITE);

foreach ($imgs as $key=>$vo) {
    $fileData = file_get_contents($vo);
    if ($fileData) {
        $zip->addFromString($key.'.jpg', $fileData);
    }
}


$zip->close();

$file = fopen($filename, "r");
Header("Content-type: application/octet-stream");
Header("Accept-Ranges: bytes");
Header("Accept-Length: " . filesize($filename));
Header("Content-Disposition: attachment; filename=imgages.zip");
//一次只传输1024个字节的数据给客户端
$buffer = 1024; //
while (!feof($file)) {
    //将文件读入内存
    $file_data = fread($file, $buffer);
    //每次向客户端回送1024个字节的数据
    echo $file_data;
}
fclose($file);
unlink($filename);
?>
