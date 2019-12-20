const Categories = require("../models").categories;
const Articles = require("../models").articles;
const Users = require("../models").users;

// get all articles by user
const articles = data => {
  const newArticle = data.map(item => {
    let newItem = {
      id: item.id,
      title: item.title,
      content: item.content,
      image: item.image,
      category: item.category.name,
      user: item.user.fullname,
      dateCreated: item.createdAt
    };
    return newItem;
  });
  return newArticle;
};

exports.articles = (req, res) => {
  const { username } = req.params;
  Articles.findAll({
    attributes: {
      exclude: [
        "updatedAt",
        "category_id",
        "author_id",
        "is_published",
        "is_archived"
      ]
    },
    include: [
      {
        model: Categories,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_published", "is_archived"]
        },
        where: {
          is_published: true,
          is_archived: false
        }
      },
      {
        model: Users,
        as: "user",
        where: {
          username: username
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "is_active", "password"]
        }
      }
    ]
  }).then(data => {
    res.status(200), res.send(articles(data));
  });
};
