class HelloWorldController {
    index(req, res) {
        return res.status(200).json({message: 'Hello'})
    }
}

export default new HelloWorldController(); 