<?php

namespace Kendo\UI;

class SpreadsheetSheetRowCellValidation extends \Kendo\SerializableObject {
//>> Properties

    /**
    * Defines the comparer type used to validate the cell value, e.g. "greaterThan", "between" and etc.
    * @param string $value
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function comparerType($value) {
        return $this->setProperty('comparerType', $value);
    }

    /**
    * Defines the data type of the cell value.
    * @param string $value
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function dataType($value) {
        return $this->setProperty('dataType', $value);
    }

    /**
    * Defines a formula or value used for the comparison process. Used as only if comparer type does not require second argument.
    * @param string $value
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function from($value) {
        return $this->setProperty('from', $value);
    }

    /**
    * Defines a formula or value used for the comparison process. Will be used if comparer type requies second argument.
    * @param string $value
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function to($value) {
        return $this->setProperty('to', $value);
    }

    /**
    * Specifies whether to allow nulls.
    * @param string $value
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function allowNulls($value) {
        return $this->setProperty('allowNulls', $value);
    }

    /**
    * Sets the messageTemplate option of the SpreadsheetSheetRowCellValidation.
    * Defines the hint message that will be displayed if value is invalid.
    * @param string $value The id of the element which represents the kendo template.
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function messageTemplateId($value) {
        $value = new \Kendo\Template($value);

        return $this->setProperty('messageTemplate', $value);
    }

    /**
    * Sets the messageTemplate option of the SpreadsheetSheetRowCellValidation.
    * Defines the hint message that will be displayed if value is invalid.
    * @param string $value The template content.
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function messageTemplate($value) {
        return $this->setProperty('messageTemplate', $value);
    }

    /**
    * Sets the titleTemplate option of the SpreadsheetSheetRowCellValidation.
    * Defines the hint title that will be displayed if value is invalid.
    * @param string $value The id of the element which represents the kendo template.
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function titleTemplateId($value) {
        $value = new \Kendo\Template($value);

        return $this->setProperty('titleTemplate', $value);
    }

    /**
    * Sets the titleTemplate option of the SpreadsheetSheetRowCellValidation.
    * Defines the hint title that will be displayed if value is invalid.
    * @param string $value The template content.
    * @return \Kendo\UI\SpreadsheetSheetRowCellValidation
    */
    public function titleTemplate($value) {
        return $this->setProperty('titleTemplate', $value);
    }

//<< Properties
}

?>
