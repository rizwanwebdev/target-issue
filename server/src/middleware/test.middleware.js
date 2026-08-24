function test(req, res, next){
    console.log("running test")
    next()
}
export default test