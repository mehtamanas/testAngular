<?php
include('kendo/lib/Kendo/Autoload.php');

$series = new \Kendo\Dataviz\UI\ChartSeriesItem();
$series->type('donut')
       ->field('percentage')
       ->categoryField('source')
       ->explodeField('explode');

$dataSource = new \Kendo\Data\DataSource();

$dataSource->data(array(
    array('source' => 'Monday', 'percentage' => 22, 'explode' => false),
    array('source' => 'Tuesday', 'percentage' => 2),
    array('source' => 'Wednesday', 'percentage' => 49),
    array('source' => 'Thursday', 'percentage' => 27),
    array('source' => 'Friday', 'percentage' => 30)
));

$chart = new \Kendo\Dataviz\UI\Chart('charta2');

$chart->title(array('text' => ''))
      ->dataSource($dataSource)
      ->addSeriesItem($series)
      ->legend(array('position' => 'top'))
      ->seriesColors(array('#FF6D01', '#FF6D01', '#FF6D01', '#FF6D01'))
      ->tooltip(array('visible' => true, 'template' => '${ category } - ${ value }%'));

echo $chart->render();
?>

