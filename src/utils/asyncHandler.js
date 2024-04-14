const asyncHandeler = (reqesthandler) => {
   return (req,res,next) => {
        Promise.resolve(reqesthandler(req,res,next)).
        catch((err) => next(err))
    }
}


export {asyncHandeler}


// const asyncHandeler = () => {}
// const asyncHandeler = (func) => () => {}
// const asyncHandeler = (func) => async () => {}

// const asyncHandeler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)

//     } catch (error) {
//         res.status(err.code || 500).json({

//           success: false,
//           Message: err.Message

//         })
//     }
// }