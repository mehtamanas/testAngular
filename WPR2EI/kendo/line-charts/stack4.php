<?php
include('kendo/lib/Kendo/Autoload.php');
$gold = new \Kendo\Dataviz\UI\ChartSeriesItem();
$gold->name('Gold Medals')
     ->data(array(40, 32,67,70, 83, 36, 37, 44, 37, 35, 36, 46))
     ->color('#E75555');


$valueAxis = new \Kendo\Dataviz\UI\ChartValueAxisItem();

$valueAxis->max(90)
          ->line(array('visible' => false))
          ->majorGridLines(array('visible' => true));

$categoryAxis = new \Kendo\Dataviz\UI\ChartCategoryAxisItem();
$categoryAxis->categories(array())
             ->majorGridLines(array('visible' => false));


$tooltip = new \Kendo\Dataviz\UI\ChartTooltip();
$tooltip->visible(true)
        ->template('#= series.name #: #= value #');

$chart = new \Kendo\Dataviz\UI\Chart('chart15');
$chart->title(array('text' => ''))
      ->legend(array('visible' => false))
      ->addSeriesItem($gold)
      ->addValueAxisItem($valueAxis)
      ->addCategoryAxisItem($categoryAxis)
      ->tooltip($tooltip)
      ->seriesDefaults(array('type' => 'line', 'missingValues' => 'gap', 'stack' => true));

echo $chart->render();
?>

