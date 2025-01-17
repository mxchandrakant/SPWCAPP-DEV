const {generateAccessToken} = require('../../common/jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginOne = async(req,res) => {
    const { mobileno } = req.body;
    try{
        const {rows} = await conn.query("select customer_id,firstname,lastname,emailid,mobileno from mst_customers where mobileno=$1",[mobileno]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:"Mobile no. not exist in system.",error_code:ecode.auth.SYSC0101, data:{} })
        }

        //check isblock
        const isBlock= checkBlock(rows);
        if(isBlock){ return res.status(400).send(isBlock) }

        //generate token
        const token = await generateAccessToken(rows[0]);
        res.status(200).send({ success:true,message:"Login successfully.", data:{customer:rows[0],token:token} })

    }catch (error) {
        return res.status(400).send({ success:false,message:"Something wents wrong.", error_code:ecode.auth.SYSC0110, data:{ error:error } })
    }
}

const loginTwo = async (req,res) => {
    const { mobileno,password } = req.body;
  
    try{
        const {rows } = await conn.query("select customer_id,firstname,lastname,emailid,mobileno,password from mst_customers where mobileno=$1 and isverified=1",[mobileno]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:"Enter valid mobile or password.",error_code:ecode.auth.SYSC0103, data:{} })
        }

        const bpass = await bcrypt.compare(password,rows[0].password);
        if(!bpass){ 
            return res.status(400).send({ success:false,message:"Enter valid mobile or password.",error_code:ecode.auth.SYSC0103, data:{} })
        }

        //check isblock
        const isBlock= checkBlock(rows);
        if(isBlock){ return res.status(400).send(isBlock) }

        const data = _.omit(rows[0],'password');

        //generate token
        const token = await generateAccessToken(data);
        res.status(200).send({ success:true,message:"Login successfully.", data:{customer:data,token:token} })
    }catch (error) {
        return res.status(400).send({ success:false,message:"Something wents wrong.", error_code:ecode.auth.SYSC0110, data:{ error:error } })
    }
}

const checkBlock = (rows) => {
    if(rows[0].isblock == 1){
        return { success:false,message:"You are block. Please contact to scrapwale",error_code:ecode.auth.SYSC0102, data:{} }
    }
}

module.exports = {
    loginOne,
    loginTwo
}