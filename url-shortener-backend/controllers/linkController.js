exports.getLinks = async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 5, search = '' } = req.query;
  
      const query = {
        user: userId,
        $or: [
          { originalUrl: { $regex: search, $options: 'i' } },
          { shortId: { $regex: search, $options: 'i' } },
        ],
      };
  
      const links = await Link.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const total = await Link.countDocuments(query);
  
      res.json({ links, total });
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  };
  