<?php
//include('kendo/lib/Kendo/Autoload.php');

$mumbai = new \Kendo\Dataviz\UI\ChartSeriesItem();
$mumbai->name('Mumbai')
      ->data(array(5.907));

$delhi = new \Kendo\Dataviz\UI\ChartSeriesItem();
$delhi->name('Delhi')
       ->data(array(4.743));

$kolkata = new \Kendo\Dataviz\UI\ChartSeriesItem();
$kolkata->name('Kolkata')
        ->data(array(1.010));

$bengaluru = new \Kendo\Dataviz\UI\ChartSeriesItem();
$bengaluru->name('Bengaluru')
      ->data(array(2.988));
	  
$noida = new \Kendo\Dataviz\UI\ChartSeriesItem();
$noida->name('Noida')
      ->data(array(3.988));


$cateogrySeriesAxis = new \Kendo\Dataviz\UI\ChartCategoryAxisItem();
$cateogrySeriesAxis->name("series-axis")
             ->line(array('visible' => false));

$categoryLabelsAxis = new \Kendo\Dataviz\UI\ChartCategoryAxisItem();
$categoryLabelsAxis->name("series-labels")
             ->categories(array(2006, 2007, 2008, 2009, 2010));

$valueAxis = new \Kendo\Dataviz\UI\ChartValueAxisItem();
$valueAxis->labels(array('format' => '{10}'))
          ->line(array('visible' => false))
          // Push the series-labels axis all the way down the value axis
          ->axisCrossingValue(array(0, -PHP_INT_MAX));

$tooltip = new \Kendo\Dataviz\UI\ChartTooltip();
$tooltip->visible(true)
        ->format('{10}')
        ->template('#= series.name #: #= value #');

$chart = new \Kendo\Dataviz\UI\Chart('chart4');
$chart->title(array('text' => ''))
      ->legend(array('position' => 'top'))
	   ->seriesColors(array('#569CE1', '#FECE00', '#FF6D01', '#DB39BE','#BDC87C'))
      ->addSeriesItem($mumbai, $delhi, $kolkata, $bengaluru,$noida)
      ->addValueAxisItem($valueAxis)
      ->addCategoryAxisItem($cateogrySeriesAxis)
      ->addCategoryAxisItem($categoryLabelsAxis)
      ->tooltip($tooltip)
      ->chartArea(array('background' => 'transparent'))
      ->seriesDefaults(array('type' => 'column'));

echo $chart->render();
?>

<style type="text/css">
    #chart4 {
        background: center no-repeat url('../content/shared/styles/world-map.png');
    }
</style>