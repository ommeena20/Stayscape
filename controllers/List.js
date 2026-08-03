
const Listitem = require("../models/list.js");
const Client=require("../models/Client.js");
module.exports.index=async (req, res) => {
    let content = await Listitem.find({});
    res.render("listitems/idx.ejs", { content });
}

//New form
module.exports.renderForm=(req, res) => {
   
        res.render("listitems/create.ejs");
  
}
module.exports.Search = async (req, res) => {
    const { q } = req.query;

    const item = await Listitem.findOne({
        title: { $regex: q, $options: "i" }
    })
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");

    if (!item) {
        req.flash("error", "No listing found!");
        return res.redirect("/listitems");
    }

    console.log(item.reviews); // Check if reviews are populated

    res.render("listitems/show.ejs", { item });
};


module.exports.Showlist = async (req, res) => {
    if (!req.user) {
        req.flash("error", "Please login first.");
        return res.redirect("/login");
    }

    const Userwatchlist = await Client.findById(req.user._id)
        .populate("wishlist");

    return res.render("listitems/Wishlist", { Userwatchlist });
};
module.exports.Deletewishlist = async (req, res) => {
    let{id}=req.params;
    await Client.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: id }
     });
     req.flash("success", "Removed from wishlist!");
    res.redirect("/listitems/wishlist");
};
module.exports.gallery = async (req, res) => {
    let content = await Listitem.find({});
    res.render("listitems/Gallery.ejs", { content });
}

// SHOW ALL USERS

//Create form

module.exports.createForm = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    const {
        title,
        description,
        price,
        location,
        country
    } = req.body;

    await Listitem.create({
        title,
        description,
        price,
        location,
        country,
        image: { url, filename },
        owner: req.user._id,
    });

    req.flash("success", "hurray done the job!!!");

    res.redirect("/listitems");
}
module.exports.addwishlist=async(req,res)=>{
    try {
        let { id } = req.params;

        let client = await Client.findById(req.user._id);

        if (!client.wishlist.includes(id)) {
            client.wishlist.push(id);
            await client.save();
        }

        res.redirect(`/listitems/${id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

}


// SHOW - single item
module.exports.showsingleitem=async (req, res) => {

    let item = await Listitem.findById(req.params.id).populate({
      path:"reviews",
      populate:{
        path:"author"
      }
    }).populate("owner");
    if(!item){
       req.flash("error","already deleted the item")
       return res.redirect("/listitems");
    }
   
    res.render("listitems/show.ejs", { item });

   
  }


// EDIT form
module.exports.editForm=async (req, res) => {
 
    let{id}=req.params;
     let item = await Listitem.findById(id);
    


  let originalimageUrl = item.image.url.replace(
  "/upload",
  "/upload/h_120,w_250"
);

res.render("listitems/editform.ejs", { item, originalimageUrl });
  }


// UPDATE item
module.exports.updatelist = async (req, res) => {

    const {
        title,
        description,
        price,
        location,
        country,
        image
    } = req.body;

    let updatelist = await Listitem.findByIdAndUpdate(req.params.id, {
        title,
        description,
        price,
        location,
        country,
        image,
    });

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        updatelist.image = { url, filename };
        await updatelist.save();
    }

    res.redirect(`/listitems/${req.params.id}`);
}


// DELETE item
module.exports.deletelist=async (req, res) => {
    await Listitem.findByIdAndDelete(req.params.id);
    res.redirect("/listitems");
  }