<?php
// 資料庫連線設定
$serverName = "MINDY"; // 伺服器名稱或 IP
$database = "password";           // 資料庫名稱
$username = "sa";   // 資料庫使用者
$password = "Mindy@@34930209";   // 資料庫密碼

// 建立連線
$connectionInfo = array("Database"=>$database, "UID"=>$username, "PWD"=>$password);
$conn = sqlsrv_connect($serverName, $connectionInfo);

if (!$conn) {
    die(print_r(sqlsrv_errors(), true));
}

// 獲取表單輸入的帳號與密碼
$userInput = $_POST['username'];
$passInput = $_POST['password'];

// 查詢資料庫檢查帳號密碼是否存在
$sql = "SELECT * FROM users WHERE username = ? AND password = ?";
$params = array($userInput, $passInput);
$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

// 驗證結果
if (sqlsrv_fetch_array($stmt)) {
    echo "<h2>登入成功！</h2>";
} else {
    echo "<h2>帳號或密碼錯誤，請重試。</h2>";
}

// 關閉連線
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>
