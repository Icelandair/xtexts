# xtexts

A minimal utility for pulling translation strings from a project. It mimics xgettext to some degree and can emit .po format, but it can work on JSX and modern .es files.

## Install

    npm install xtexts --save-dev
    

## CLI commands:


### Extract

Extract translatable texts from a project.

    xtexts extract <path>

Will print out a list translation terms in the format specified (defaulting to gettext .po).

You may specify format with the `--format` option, which can be any of `json`, `csv`, or `gettext`.

    xtexts extract --format csv src/

Supply a list of function names to be read by the `--keyword` (or `-k`) option. The format xtests likes is [the same as xgettext's.](https://www.gnu.org/savannah-checkouts/gnu/gettext/manual/html_node/xgettext-Invocation.html#Language-specific-options)

There is no upper limit to the amount you can supply. The program defaults to most of the standard gettext ones:

* `_`
* `gettext`
* `dgettext`
* `dcgettext`
* `ngettext`
* `dngettext`
* `ppgettext`
* `dpgettext`

Be warned that what xtexts reads is any call to a function that has any of these keywords. The following are equivalent in the eyes of the parser:

    foo.bar.gettext("string")
    gettext("string")


### Use

Dump a JSON dictionary of usage from the project.

This performs the same run as the `extract` command, except the output is a JSON formatted dictionary of term usage.

    {
      "term1": [ "src/foo.js:10", "src/bar.js:5" ],
      "term2": [ "src/bar.js:34" ],
      "term3": [ "src/baz.js:17" ]
    }

This can be useful to help you track conflicts in your project.


### Test

Test if any translations are broken.

Will run against the project and report any flawed translation calls. Currently, this means any instances where a translation function has been called but no string was detected. This normally indicates a developer absent mindely trying to use template strings or passing variables.

The process exits with a code 1 if any problems were found but otherwise does nothing. Perfect for putting your tests.
