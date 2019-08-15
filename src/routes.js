import Home from './routes/Home.svelte'
import Name from './routes/Name.svelte'
import NotFound from './routes/NotFound.svelte'

export default {
    // Exact path
    '/': Home,

    // Allow children to also signal link activation
    '/brand': Home,

    // Using named parameters, with last being optional
    '/hello/:first/:last?': Name,

    // Catch-all, must be last
    '*': NotFound,
}
