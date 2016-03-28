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

$chart = new \Kendo\Dataviz\UI\Chart('chart');

$chart->title(array('text' => ''))
      ->dataSource($dataSource)
      ->addSeriesItem($series)
      ->legend(array('position' => 'bottom'))
      ->seriesColors(array('#42a7ff', '#666666', '#999999', '#cccccc'))
      ->tooltip(array('visible' => true, 'template' => '${ category } - ${ value }%'));

echo $chart->render();
?>
