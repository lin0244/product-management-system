package by.kraskovski.pms.controller;

import by.kraskovski.pms.service.AuthorityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for {@link AuthorityService}.
 */
@RestController
@RequestMapping("/authority")
public class AuthorityController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthorityController.class);
    private final AuthorityService authorityService;

    @Autowired
    public AuthorityController(final AuthorityService authorityService) {
        this.authorityService = authorityService;
    }

    /**
     * Return json-information about all authorities in database.
     */
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity loadAuthorities() {
        LOGGER.info("Start loadAuthorities");
        try {
            return new ResponseEntity<>(authorityService.findAll(), HttpStatus.OK);
        } catch (DataAccessException e) {
            LOGGER.error("Exception in loadAuthorities. " + e.getLocalizedMessage());
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
