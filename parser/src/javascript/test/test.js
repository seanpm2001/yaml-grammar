// Generated by CoffeeScript 2.5.0
(function() {
  //!/usr/bin/env coffee
  var main, test_parse;

  require('../lib/prelude');

  require('../lib/parser');

  // require '../lib/debug-parser'
  require('../lib/test-receiver');

  main = function(yaml, rule = 'TOP', ...args) {
    args = _.map(args, function(a) {
      if (a === 'null') {
        return null;
      } else if (a.match(/^-?[0-9]+$/)) {
        return Number(a);
      } else {
        return a;
      }
    });
    return test_parse(yaml, rule, args);
  };

  test_parse = function(yaml, rule = null, args = []) {
    var e, n, parser, pass, start, time, trace;
    if (process.env.DEBUG) {
      require('../lib/debug-parser');
      parser = new DebugParser(new TestReceiver());
    } else {
      parser = new Parser(new TestReceiver());
    }
    if (rule == null) {
      rule = 'TOP';
    }
    if (_.isString(rule)) {
      rule = parser[rule];
    }
    if (args.length > 0) {
      rule = [rule, ...args];
    }
    pass = true;
    trace = process.env.TRACE;
    start = timer();
    try {
      parser.parse(yaml, rule, trace);
    } catch (error) {
      e = error;
      warn(e);
      pass = false;
    }
    time = timer(start);
    if (yaml.match(/\n./)) {
      n = "\n";
    } else {
      n = '';
      yaml = yaml.replace(/\n$/, '\\n');
    }
    if (pass) {
      say(`PASS - '${n}${yaml}'`);
      say(parser.receiver.output());
      say(sprintf("Parse time %.5fs", time));
      return true;
    } else {
      say(`FAIL - '${n}${yaml}'`);
      say(parser.receiver.output());
      say(sprintf("Parse time %.5fs", time));
      return false;
    }
  };

  if (process.argv.length > 2) {
    if (main(...process.argv.slice(2))) {
      exit(0);
    } else {
      exit(1);
    }
  }

  test_parse("[1,2 2  ,333,]");

  // test_parse "[123]"
// test_parse "a: b"
// test_parse ""
// test_parse "---\n"
// test_parse "..."
// test_parse "[]  # foo"
// test_parse "[ foo ]"
// test_parse "{}"
// test_parse "{}\n"
// test_parse "''"

  // vim: sw=2:

}).call(this);
