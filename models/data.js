const mongoose=require('mongoose');
const mongoosePaginate =require('mongoose-paginate')
const Schema = mongoose.Schema;

const schema = new Schema({
  imagePath:{type:String, required: true},
  title:{type:String, required: true},
  description:{type:String, required: true},
  price:{type:Number , required:true}
});

schema.plugin(mongoosePaginate);



module.exports= mongoose.model('Data', schema);
