SHELL := bash

ROOT := $(shell pwd)

SPEC12_URL := https://yaml.org/spec/1.2/spec.html
SPEC12_TXT := yaml-spec-1.2.txt
SPEC12_YAML := yaml-spec-1.2.yaml
SPEC12_JSON := yaml-spec-1.2.json
SPEC12_COMMENTS := yaml-spec-1.2-comments.yaml
SPEC12_YAML_PATCH := yaml-spec-1.2-yaml.patch
SPEC12_PATCH_YAML := yaml-spec-1.2-patch.yaml
SPEC12_PATCH_JSON := yaml-spec-1.2-patch.json

BUILD := $(SPEC12_PATCH_YAML) $(SPEC12_JSON) $(SPEC12_PATCH_JSON)

PATH := $(ROOT)/bin:$(PATH)
PATH := $(ROOT)/node_modules/.bin:$(PATH)
export PATH

.DELETE_ON_ERROR:
#------------------------------------------------------------------------------
default:

force:

build: node_modules $(BUILD)

build-yaml: $(SPEC12_PATCH_YAML)

comments: $(SPEC12_COMMENTS)

clean:
	rm -fr node_modules
	rm -f package-lock.json yaml-spec-1.2-patch.yaml.orig

$(SPEC12_TXT):
	lynx --dump $(SPEC12_URL) > $@

$(SPEC12_YAML): $(SPEC12_TXT) Makefile bin
	yaml-grammar-html-to-yaml $< $(SPEC12_COMMENTS) > $@

$(SPEC12_JSON): $(SPEC12_YAML)
	yaml-grammar-yaml-to-json < $< > $@

$(SPEC12_COMMENTS): force
	yaml-grammar-to-comments $(SPEC12_YAML) > $@

$(SPEC12_PATCH_YAML): $(SPEC12_YAML) $(SPEC12_YAML_PATCH)
	cp $< $@
	patch $@ $(SPEC12_YAML_PATCH)

$(SPEC12_PATCH_JSON): $(SPEC12_PATCH_YAML)
	yaml-grammar-yaml-to-json < $< > $@

node_modules:
	git branch --track $@ origin/$@ 2>/dev/null || true
	git worktree add -f $@ $@
