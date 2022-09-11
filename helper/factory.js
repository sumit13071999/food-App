module.exports.createElement = function (ElementModel) {
    return async function createUser(req, res) {
        try {
            let element = req.body;
            if (element) {
                element = await ElementModel.create(element);
                res.status(200).json({
                    element: element
                });
            } else {
                res.status(200).json({
                    message: "kindly enter the data"
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }

    }
}
module.exports.getElement = function (ElementModel) {
    return async function getElements(req, res) {
        try {
            //filter
            //sort
            //remove
            //paginate
             let requestPromise;
             if(req.query.myquery){
                requestPromise= ElementModel.find(req.query.myquery);
             }else{
                requestPromise= ElementModel.find();
             }
             //sort
             if(req.query.sort){
                requestPromise=requestPromise.sort(req.query.sort);
             }
             ///select
             if(req.query.select){
                 let params = req.query.select.split("%").join(" ");
                 requestPromise=requestPromise.select(params);   
             }
            //  paginate

            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let toSkip = (page - 1) * limit;
            requestPromise = requestPromise.skip(toSkip).limit(limit);
            let Elements = await requestPromise;
            res.status(200).json({
                "message": "list of all the Elements",
                Element: Elements
            })
        } catch (err) {
            res.status(500).json({
                error: err.message,
                "message": " can't get Elements"
            })
        }

    }
}
module.exports.deleteElement = function (ElementModel) {
    return async function deleteElement(req, res) {
       let {id}=req.body;
        try {
          let element = await ElementModel.findByIdAndDelete(id, req.body);
            //  element = await ElementModel.findOne({ _id: id })
            if(!element){
                res.status(200).json({
                    message:"resourse not found"
                });
            }else{
                res.status(200).json(element);
            }
            
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.updateElement = function (ElementModel) {
    return async function updateElement(req, res) {
        let { id } = req.body;
        try {
            let element = await ElementModel.findById(id);
            if(element){
                delete req.body.id;
                for(let key in req.body){
                    element[key]=req.body[key];
                }
                await element.save();
                res.status(200).json(element);
            }else{
                res.status(404).json({
                    message:"resourse not found"
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.getElementById = function (ElementModel) {
    return async function getElementById(req, res) {
        try {
            let id = req.params.id;
            let Element = ElementModel.getElementById(id);
            res.status(200).json({
                Element: Element
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}