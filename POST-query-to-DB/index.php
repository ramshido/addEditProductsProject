<?php

// connection

$servername = "localhost";
$username = "root"; // стандартный пользователь для локальных серверов
$password = ""; // стандартный пароль для локальных серверов
$dbname = "(test)-Хранилище пользователей";

// Создание соединения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully <br>";

// querys

$sql = "SELECT id, Name FROM Users"; // Ваш SQL-запрос
$result = $conn->query($sql);

if ($result === false) { // проверка запроса
	die(json_encode(array("error" => "Ошибка в запросе: " . $conn->error)));
}

//
// вариант 1
// $my_data = '[';
// if ($result->num_rows > 0) {
//     // Вывод данных для каждой строки
//     while($row = $result->fetch_assoc()) {
//         $my_data .= '{' . "id: " . $row["id"] . ', "Name: "' . $row["Name"] . '}, ';
//     }
// } else {
//     echo "0 результатов";
// }
// $my_data = substr($my_data,0,-2);
// $my_data .= ']';

// echo $my_data;

// вариант 2, лутше
$my_data = array();
if ($result->num_rows > 0) {
    // Заполнение массива данными
    while($row = $result->fetch_assoc()) {
        $my_data[] = array(
            "id" => $row["id"],
            "Name" => $row["Name"],
            "City" => $row["City"]
        );
    }
} else {
    echo json_encode(array("message" => "0 результатов"), JSON_UNESCAPED_UNICODE);
    exit;
}

// Установка заголовка и вывод JSON данных
header('Content-Type: application/json');
echo json_encode($my_data, JSON_UNESCAPED_UNICODE);

// Закрытие соединения
$conn ->close()
?>