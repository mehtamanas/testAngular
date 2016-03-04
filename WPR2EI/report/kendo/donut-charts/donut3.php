<?php
//include('kendo/include/chart_data.php');
include('kendo/lib/Kendo/Autoload.php');

$series = new \Kendo\Dataviz\UI\ChartSeriesItem();
$series->type('donut')
       ->data(array(
            array('category' => 'Facebook', 'value' => 35),
            array('category' => 'Twitter', 'value' => 25),
            array('category' => 'Google+', 'value' => 20),
            array('category' => 'Blog', 'value' => 10),
            array('category' => 'Youtube', 'value' => 10)
       ));

$chart = new \Kendo\Dataviz\UI\Chart('charts114');

$chart->title(array('text' => ''))
      ->addSeriesItem($series)
      ->legend(array('position' => 'top'))
	   ->seriesColors(array('#569CE1', '#2AC9F3', '#FF6D01', '#E8A733','#E34343'))
      ->tooltip(array('visible' => false, 'template' => "#= category # - #= kendo.format('{0:P}', percentage) #"))
      ->seriesDefaults(array(
          'labels' => array(
              'template' => "#= category # - #= kendo.format('{0:P}', percentage)#",
              'position' => 'outsideEnd',
              'visible' => false,
              'background' => 'transparent'
          )
      ));

echo $chart->render();
?>
<script>
$(document).ready(function() {
    $(".configuration-horizontal").bind("change", refresh);
});

function refresh() {
    var chart = $("#charts114").data("kendoChart"),
        pieSeries = chart.options.series[0],
        labels = $("#labels").prop("checked"),
        alignInputs = $("input[name='alignType']"),
        alignLabels = alignInputs.filter(":checked").val();

    chart.options.transitions = false;
    pieSeries.labels.visible = labels;
    pieSeries.labels.align = alignLabels;

    alignInputs.attr("disabled", !labels);

    chart.refresh();
}
</script>
