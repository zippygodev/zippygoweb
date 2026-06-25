import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(@Query("q") query: string) {
    return this.searchService.search(query);
  }

  @Get("trending")
  async getTrending() {
    return this.searchService.getTrending();
  }
}
