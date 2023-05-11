const express = require("express");
const {Board, BoardComment} = require("../models");
const router = express.Router();

router.get('/:board_id',async (req,res,next) => {
   try{
       //게시판 총 갯수
       const commentCount = await BoardComment.findAndCountAll({
           where:{
               board_id:req.params.board_id
           }
       });
       const totalCount = commentCount.count;//게시판 총갯수
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
       const datas = await BoardComment.findAll({
           attributes: ['id','content','user_id','writer','createdAt'],
           where:{
               board_id:req.params.board_id
           },
           order:[['id','desc']],
           limit:[fromRecord,limit]
       });
       return res.status(200).json({datas,pages});
   } catch(error){
       console.error(error);
   }
});
//남은 시간에 이거 실습하시면 됩니다.
router.post('/:board_id/update',async (req,res,next)=>{

    if(req.body.mode==='update'){
        await BoardComment.update({
            content:req.body.content
        },{
            where:{
                id:req.body.comment_id
            }
        });
        return res.status(200).json({data: '댓글 수정 완료'});
    }else {

        await BoardComment.create({
            user_id: req.body.user_id,
            user_name: req.body.user_name,
            content: req.body.content,
            board_id: req.body.board_id
        });
        return res.status(200).json({data: '댓글 등록 완료'});
    }
});
router.delete("/:board_id/remove/:id", async (req, res, next) => {
    try{
        await BoardComment.destroy({
            where:{
                id:req.params.id
            }
        });
        return res.status(200).json({is_success:true});
    }catch(e){

    }

});
module.exports = router;