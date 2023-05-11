const express = require("express");
const {Board,BoardFile,BoardComment} = require('../models');
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require('multer');
const {Sequelize} = require("sequelize");
const { Op } = require('sequelize');
const router = express.Router();

//업로드를 할 때 필요로 함
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            console.log(req);
            cb(null, 'uploads/board');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});
router.get("/",async (req,res,next) => {
   return res.send(req.session);
});
//파일업로드
router.post('/upload', upload.single('image'), (req, res) => {
    return res.status(200).send(req.file.filename);
});
router.post("/update", async (req,res,next)=>{
    try{
        console.log(req.user);
        const user_id=req.user!==undefined?req.user.user_id:'';
        const writer = req.user!==undefined?req.user.user_name:req.body.writer;
        let hashPassword = '';
        if(req.body.board_password !== ''){
            hashPassword = await bcrypt.hash(req.body.board_password,12);
        }
        if(req.body.mode===''){
            await Board.create(
                {
                    user_id:user_id,
                    writer:writer,
                    board_secret:req.body.board_secret,
                    board_password:hashPassword,
                    subject:req.body.subject,
                    content:req.body.content,
                }
            ).then(async (result) => {
                await BoardFile.create({
                    file_no:1,
                    board_file:req.body.board_file,
                    board_id:result.id
                });
            }).catch((error) => {
                console.error(error);
            });
        }else{
            await Board.update({
                board_password:hashPassword,
                subject:req.body.subject,
                content:req.body.content
            },{
                where:{
                    id:req.body.id
                }
            });
        }
        return res.status(200).json({is_success:true,message:`게시판을 ${req.body.mode===''?'등록':'수정'}되었습니다.`});
    }catch(error){
        console.error(error);
        return res.status(403).json({is_success:false,message:error})
    }
});
router.get('/list', async (req,res,next) => {
   try{

       console.log(req.user);
       let where= {};
       console.log(req.query);
       if(req.query.field && req.query.keyword ){
           //where={subject:{[Op.like]:`%${val}%`}};
           where = {
               [req.query.field]:{
                   [Op.like]:`%${req.query.keyword}%`
               }
           }
       }
       //게시판 총 갯수
       const boardCount = await Board.findAndCountAll({
           where
       });
       const totalCount = boardCount.count;//게시판 총갯수
       const page = req.query.page || 1;
       const limit = 2;
       const pageSize = 10;//보여주는 페이지 수
       const fromRecord = (page - 1) * limit;//limit 첫 번째 수
       const totalPage = Math.ceil(totalCount / limit);//총 페이지 수
       const startPage = (Math.ceil(page / pageSize) - 1) * pageSize + 1;//페이지 그룹에 첫번째 페이지
       let lastPage = startPage + pageSize + 1;//마지막 페이지
       lastPage = totalPage < lastPage ? totalPage : lastPage;
       const fromRecordPage = [];//한 그룹에 보여줄 페이지
       for (let i = startPage - 1; i < lastPage; i++) {
           fromRecordPage.push(i);
       }
       //프론트엔드에 보낼 페이징 데이터
       const pages = {
           pageSize: pageSize,
           fromRecord: fromRecord,
           totalPage: totalPage,
           startPage: startPage,
           lastPage: lastPage,
           totalCount:totalCount,
           limit:limit,
           fromRecordPage: fromRecordPage,
           page: parseInt(page)
       };
       const datas = await Board.findAll({
           attributes: ['id', 'subject','content','writer','createdAt'],
           include: [{
               model: BoardComment,
           }],
           where,
           order:[['id','desc']],
           limit:[fromRecord,limit]
       });

       return res.status(200).json({datas,pages});
   } catch(error){
        console.log(error);
   }
});
router.get('/view', async (req,res,next) => {
   try{
       const data = await Board.findOne({
           where:{
               id:req.query.id
           }
       });
       return res.status(200).json(data);
   } catch(error){
   }
});
router.delete('/remove', async (req,res,next) => {
    try{
        console.log(req.body.id);
        await Board.destroy({
            where:{
                id:req.body.id
            }
        }).then(async (result) => {
            await BoardFile.destroy({
                where:{
                    board_id:req.body.id
                }
            });
            console.log(req.body.id);
        });
        return res.status(200).json({is_remove:true});
    }catch(error){

    }
});

module.exports = router;