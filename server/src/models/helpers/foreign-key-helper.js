module.exports = (model, id) => {
    return new Promise((resolve, reject) => {
        model.findOne({_id: id}, (err, result) => {
            if(result){
                return resolve(true);
            } else {
                console.log("asdf");
                return reject(
                    new Error(
                        `FK Constraint 'checkObjectExists' for '${id.toString()}' failed`
                    )
                )
            }
        })
    })
}