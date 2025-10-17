import express from "express"
const app = express();
const port = 3000;

import user from "./user.routes.js"
import event from "./event.routes.js"
import group from "./group.routes.js"
import resource from "./resource.routes.js"

//any request coming for user
app.use('/user', user);

//any request coming for events
app.use('/events', event)

//any request coming for group
app.use('/groups', group)

//any request coming for resource
app.use('/resources', resource) 

export default app