import {RXComponent} from "../../basic/rxcomponent"
import {RXArray} from "../../basic/rxarray"
import {ObjectState} from "../../basic/object-state"
import {OptionRow, RowBase, OptionResponsiveRow} from "./option-row"
import {OpLabel} from "./label"


class GroupValueLabel extends OpLabel{
  constructor(labelText){
    super(labelText)
  }  
}

export class OptionRowGroup extends RowBase{
  constructor(value, schema, fieldName, screenWidth){
    super()
    this.value = value
    this.schema = schema
    this.fieldName = fieldName
    this.screenWidth = screenWidth
    this.cssClass('option-row-group')
    this.cssClass('sub-row-collapse')
    this.titleRow = new OptionRow(['tsss'], {
      label:schema.label,
      widget:'OpLabelGroup',
    })

    this.titleRow.rowLabel.cssClass('dropdown')
    this.titleRow.rowLabel.domOn('click',()=>{
      this.tongle('sub-row-collapse')
    })

    this.pushChild(this.titleRow)
    this.body = new OptionRowGroupBody
    this.pushChild(this.body)

      console.log(schema)
    for(var fieldName in schema.fields){
      let fieldSchema = schema.fields[fieldName]
      let metaValue = value[fieldName]
      var row
      if(fieldSchema.isResponsive){
        row = new OptionResponsiveRow(metaValue, fieldSchema, fieldName, this.screenWidth)
      }
      else{
        row = new OptionRow(metaValue, fieldSchema, fieldName)
      }

      row.listenValueChaged((value, fdName)=>{
        //node.meta[fdName] = value
        //this.valueChanged(node)
      })
      row.rowLabel.cssClass('sub-label')
      this.body.pushChild(row)
    }

    //if(!isShowSub){
      //this.cssClass('sub-row-collapse')
    //}
  }//

}

class OptionRowGroupBody extends RXComponent{
  constructor(){
    super()
    this.cssClass('option-row-group-body')
  }
}