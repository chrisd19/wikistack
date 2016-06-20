var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
    // defaultValue: 'open'
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
}, {
  getterMethods: {
    route: function() {
      return '/wiki/' + this.urlTitle;
    }
  },
  hooks: {
    beforeValidate:function(page, options) {
      var generateUrlTitle = function(title) {
        if (title) {
          title = title.replace(/\s/g, "_");
          title = title.replace(/[^\w]/g, "");
          return title;
        } else {
          return Math.random().toString(36).substring(2,7);
        }
      }
      page.urlTitle = generateUrlTitle(page.title);
    }
  }
});

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {isEmail: true}
  }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};

