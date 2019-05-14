import * as express from "express";

import { HashtagController } from "./hashtag.controller";

export class Routes { 
    
    public hashtagController: HashtagController = new HashtagController();
    
    get routes(): express.Router {
        
        let router = express.Router();

        router.route('/hashtag')
                .get(this.hashtagController.getNotYetIndexedHashtags);

        router.route('/hashtag/:_id')
                .put(this.hashtagController.updateHashtag);

        return router;
    }
}